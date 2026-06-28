import { Document, Types } from "mongoose";

export type WalletTransactionStatus =
  | "pending"
  | "hold"
  | "success"
  | "failed"
  | "cancelled";

export interface IWallet extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  amount: number;
  transactionId: string;
  status: WalletTransactionStatus;
  videoReviewRequest?: Types.ObjectId;
  consultationRequest?: Types.ObjectId;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedBy: Types.ObjectId[];
}
