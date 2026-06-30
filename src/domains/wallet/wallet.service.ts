import crypto from "crypto";
import httpStatus from "http-status";
import mongoose, { ClientSession, Types } from "mongoose";
import AppError from "../../ErrorHandler/AppError";
import User from "../User/user.model";
import Wallet from "./wallet.model";

const generateTransactionId = () => crypto.randomUUID();

const deductWalletBalance = async (
  userId: string,
  amount: number,
  session: ClientSession
) => {
  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid payment amount");
  }

  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false, walletBalance: { $gte: amount } },
    { $inc: { walletBalance: -amount } },
    { session, new: true }
  ).select("walletBalance");

  if (!user) {
    throw new AppError(httpStatus.PAYMENT_REQUIRED, "Insufficient balance");
  }

  return user;
};

const creditWalletBalance = async (
  userId: string,
  amount: number,
  session: ClientSession
) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { $inc: { walletBalance: amount } },
    { session, new: true }
  ).select("walletBalance");

  if (!user) 
    throw new AppError(httpStatus.NOT_FOUND, "User not found");

  return user;
};

const createVideoReviewWalletTransaction = async (
  params: {
    senderId: string;
    receiverId: string;
    amount: number;
    videoReviewRequestId: string;
    description: string;
  },
  session: ClientSession
) => {
  const [transaction] = await Wallet.create(
    [
      {
        sender: params.senderId,
        receiver: params.receiverId,
        amount: params.amount,
        transactionId: generateTransactionId(),
        status: "pending",
        videoReviewRequest: params.videoReviewRequestId,
        description: params.description,
      },
    ],
    { session }
  );

  return transaction;
};

const createConsultationWalletTransaction = async (
  params: {
    senderId: string;
    receiverId: string;
    amount: number;
    consultationRequestId: string;
    description: string;
  },
  session: ClientSession
) => {
  const [transaction] = await Wallet.create(
    [
      {
        sender: params.senderId,
        receiver: params.receiverId,
        amount: params.amount,
        transactionId: generateTransactionId(),
        status: "pending",
        consultationRequest: params.consultationRequestId,
        description: params.description,
      },
    ],
    { session }
  );

  return transaction;
};

const getPendingWalletByVideoRequest = async (
  videoReviewRequestId: string,
  session?: ClientSession
) => {
  const query = Wallet.findOne({
    videoReviewRequest: new Types.ObjectId(videoReviewRequestId),
    status: "pending",
  });

  if (session) 
    query.session(session);

  const result = await query.exec();

  return result;
};

const getPendingWalletByConsultationRequest = async (
  consultationRequestId: string,
  session?: ClientSession
) => {
  const query = Wallet.findOne({
    consultationRequest: new Types.ObjectId(consultationRequestId),
    status: "pending",
  });

  if (session) {
    query.session(session);
  }

  return query.exec();
};

const refundVideoReviewTransaction = async (
  videoReviewRequestId: string,
  session: ClientSession
) => {
  const walletTx = await getPendingWalletByVideoRequest(
    videoReviewRequestId,
    session
  );
  if (!walletTx) 
    throw new AppError(httpStatus.NOT_FOUND, "Wallet transaction not found");

  await creditWalletBalance(walletTx.sender.toString(), walletTx.amount, session);

  walletTx.status = "cancelled";
  await walletTx.save({ session });

  return walletTx;
};

const completeVideoReviewTransaction = async (
  videoReviewRequestId: string,
  session: ClientSession
) => {
  const walletTx = await getPendingWalletByVideoRequest(
    videoReviewRequestId,
    session
  );

  if (!walletTx) 
    throw new AppError(httpStatus.NOT_FOUND, "Wallet transaction not found");

  await creditWalletBalance(
    walletTx.receiver.toString(),
    walletTx.amount,
    session
  );

  walletTx.status = "success";
  await walletTx.save({ session });

  return walletTx;
};

const refundConsultationTransaction = async (
  consultationRequestId: string,
  session: ClientSession
) => {
  const walletTx = await getPendingWalletByConsultationRequest(
    consultationRequestId,
    session
  );

  if (!walletTx) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet transaction not found");
  }

  await creditWalletBalance(walletTx.sender.toString(), walletTx.amount, session);

  walletTx.status = "cancelled";
  await walletTx.save({ session });

  return walletTx;
};

const completeConsultationTransaction = async (
  consultationRequestId: string,
  session: ClientSession
) => {
  const walletTx = await getPendingWalletByConsultationRequest(
    consultationRequestId,
    session
  );

  if (!walletTx) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet transaction not found");
  }

  await creditWalletBalance(
    walletTx.receiver.toString(),
    walletTx.amount,
    session
  );

  walletTx.status = "success";
  await walletTx.save({ session });

  return walletTx;
};

const withTransaction = async <T>(
  handler: (_session: ClientSession) => Promise<T>
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const result = await handler(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const WalletService = {
  deductWalletBalance,
  creditWalletBalance,
  createVideoReviewWalletTransaction,
  createConsultationWalletTransaction,
  getPendingWalletByVideoRequest,
  getPendingWalletByConsultationRequest,
  refundVideoReviewTransaction,
  refundConsultationTransaction,
  completeVideoReviewTransaction,
  completeConsultationTransaction,
  withTransaction,
};

export default WalletService;
