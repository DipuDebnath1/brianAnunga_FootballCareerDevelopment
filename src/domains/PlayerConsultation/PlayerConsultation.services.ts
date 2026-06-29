import httpStatus from "http-status";
import { PopulateOptions, Types } from "mongoose";
import AppError from "../../ErrorHandler/AppError";
import {
  CoachBaseService,
  PlayerConsultationBaseService,
  RatingBaseService,
} from "../../service";
import { ROLE } from "../../utills/roles";
import WalletService from "../wallet/wallet.service";
import {
  PlayerConsultationStatus,
  TPlayerConsultationStatus,
} from "./PlayerConsultation.interface";
import {
  AddConsultationReviewInput,
  CompleteConsultationInput,
  CreateConsultationInput,
  UpdateConsultationMeetingInput,
  UpdateConsultationStatusInput,
} from "./PlayerConsultation.validation";

const getRequestForPlayer = async (userId: string, requestId: string) => {
  const request = await PlayerConsultationBaseService.findById(requestId, {
    select: "player coach consultationTopic bookingSlot questions status isReviewed meetingLink consultationFee coachFeedback",
    populate: [
      {
        path: "coach",
        select: "name email phone image isAvailable consultationFee",
      },
    ],
  });

  if (!request || request.player.toString() !== userId) {
    throw new AppError(httpStatus.NOT_FOUND, "Consultation booking not found");
  }

  return request;
};

const getRequestForCoach = async (userId: string, requestId: string) => {
  const request = await PlayerConsultationBaseService.findById(requestId, {
    select: "player coach consultationTopic bookingSlot questions status isReviewed meetingLink consultationFee coachFeedback",
    populate: [
      {
        path: "player",
        select: "name email phone image",
      },
    ],
  });

  if (!request || request.coach.toString() !== userId) {
    throw new AppError(httpStatus.NOT_FOUND, "Consultation booking not found");
  }

  return request;
};

const createConsultation = async (
  userId: string,
  role: string,
  payload: CreateConsultationInput
) => {
  if (role !== ROLE.player) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only players can book consultations"
    );
  }

  const coach = await CoachBaseService.findOne({
    filters: { author: payload.coach },
    select: "isAvailable consultationFee",
  });

  if (!coach) 
    throw new AppError(httpStatus.NOT_FOUND, "Coach not found");
  

  if (!coach.isAvailable) 
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Coach is not available right now"
    );
  

  if (!coach.consultationFee || coach.consultationFee <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Coach consultation fee is not available"
    );
  }

  return WalletService.withTransaction(async (session) => {
    await WalletService.deductWalletBalance(
      userId,
      coach.consultationFee,
      session
    );

    const request = await PlayerConsultationBaseService.create(
      {
        player: new Types.ObjectId(userId),
        coach: new Types.ObjectId(payload.coach),
        consultationTopic: payload.consultationTopic,
        bookingSlot: payload.bookingSlot,
        questions: payload.questions,
        status: PlayerConsultationStatus.PENDING,
        isReviewed: false,
      },
      session
    );

    await WalletService.createConsultationWalletTransaction(
      {
        senderId: userId,
        receiverId: payload.coach,
        amount: coach.consultationFee,
        consultationRequestId: request._id.toString(),
        description: `Consultation payment for "${payload.consultationTopic}"`,
      },
      session
    );

    return request;
  });
};

const getConsultations = async (
  userId: string,
  role: string,
  status?: TPlayerConsultationStatus
) => {
  const filters: Record<string, unknown> = {};
  let select: string = "";
  let populate: PopulateOptions[] = [];

  if (role === ROLE.player) {
    filters.player = userId;
    select = "player coach consultationTopic bookingSlot questions status isReviewed meetingLink consultationFee coachFeedback";
    populate = [
      {
        path: "coach",
        select: "name email phone image isAvailable consultationFee",
      },
    ];
  } else if (role === ROLE.coach) {
    filters.coach = userId;
    select = "player coach consultationTopic bookingSlot questions status isReviewed meetingLink consultationFee coachFeedback";
    populate = [
      {
        path: "player",
        select: "name email phone image",
      },
    ];
  } else {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden");
  }

  if (status) {
    filters.status = status;
  }

  return PlayerConsultationBaseService.findMany({
    filters,
    select,
    populate,
    sort: { createdAt: -1 },
  });
};

const getConsultationById = async (
  userId: string,
  role: string,
  requestId: string
) => {
  if (role === ROLE.player) {
    return getRequestForPlayer(userId, requestId);
  }

  if (role === ROLE.coach) {
    return getRequestForCoach(userId, requestId);
  }

  throw new AppError(httpStatus.FORBIDDEN, "Forbidden");
};

const updateConsultationStatus = async (
  userId: string,
  role: string,
  requestId: string,
  payload: UpdateConsultationStatusInput
) => {
  if (role !== ROLE.coach) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only coaches can accept or decline consultations"
    );
  }

  const request = await getRequestForCoach(userId, requestId);

  if (request.status !== PlayerConsultationStatus.PENDING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only pending consultations can be accepted or declined"
    );
  }

  if (payload.status === PlayerConsultationStatus.DECLINE) {
    return WalletService.withTransaction(async (session) => {
      await WalletService.refundConsultationTransaction(requestId, session);

      const updated = await PlayerConsultationBaseService.updateById(
        requestId,
        { $set: { status: payload.status } },
        session
      );

      if (!updated) 
        throw new AppError(httpStatus.NOT_FOUND, "Consultation booking not found");
      

      return updated;
    });
  }

  const updated = await PlayerConsultationBaseService.updateById(requestId, {
    $set: { status: payload.status },
  });

  if (!updated) 
    throw new AppError(httpStatus.NOT_FOUND, "Consultation booking not found");
  

  return updated;
};

const startConsultation = async (
  userId: string,
  role: string,
  requestId: string
) => {
  if (role !== ROLE.coach) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only coaches can start consultations"
    );
  }

  const request = await getRequestForCoach(userId, requestId);

  if (request.status !== PlayerConsultationStatus.ACCEPT) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only accepted consultations can be started"
    );
  }

  if (!request.meetingLink?.trim()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Meeting link is required before starting consultation"
    );
  }

  const updated = await PlayerConsultationBaseService.updateById(requestId, {
    $set: { status: PlayerConsultationStatus.STARTED },
  });

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Consultation booking not found");
  }

  return updated;
};

const updateConsultationMeeting = async (
  userId: string,
  role: string,
  requestId: string,
  payload: UpdateConsultationMeetingInput
) => {
  if (role !== ROLE.coach) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only coaches can update consultation meeting details"
    );
  }

  const request = await getRequestForCoach(userId, requestId);

  if (
    request.status !== PlayerConsultationStatus.ACCEPT
  ) 
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Meeting details can only be updated for accepted consultations"
    );



  const updateData: Record<string, string> = {};

  if (payload.meetingLink !== undefined) {
    updateData.meetingLink = payload.meetingLink;
  }
  if (payload.bookingSlot !== undefined) {
    updateData.bookingSlot = payload.bookingSlot;
  }

  const updated = await PlayerConsultationBaseService.updateById(requestId, {
    $set: updateData,
  });

  if (!updated) 
    throw new AppError(httpStatus.NOT_FOUND, "Consultation booking not found");
  

  return updated;
};

const cancelConsultation = async (
  userId: string,
  role: string,
  requestId: string
) => {
  if (role === ROLE.player) {
    const request = await getRequestForPlayer(userId, requestId);

    if (request.status !== PlayerConsultationStatus.PENDING) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Player can cancel only before coach accepts or declines"
      );
    }
  } else if (role === ROLE.coach) {
    const request = await getRequestForCoach(userId, requestId);

    if (
      request.status !== PlayerConsultationStatus.PENDING &&
      request.status !== PlayerConsultationStatus.ACCEPT && 
      request.status !== PlayerConsultationStatus.STARTED
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "sorry you can't cancel this consultation"
      );
    }
  } else {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden");
  }

  return WalletService.withTransaction(async (session) => {
    await WalletService.refundConsultationTransaction(requestId, session);

    const updated = await PlayerConsultationBaseService.updateById(
      requestId,
      {
        $set: {
          status: PlayerConsultationStatus.CANCELLED,
          cancelledBy: new Types.ObjectId(userId),
        },
      },
      session
    );

    if (!updated) {
      throw new AppError(httpStatus.NOT_FOUND, "Consultation booking not found");
    }

    return updated;
  });
};

const completeConsultation = async (
  userId: string,
  role: string,
  requestId: string,
  payload: CompleteConsultationInput
) => {
  if (role !== ROLE.coach) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only coaches can complete consultations"
    );
  }

  const request = await getRequestForCoach(userId, requestId);

  if (request.status !== PlayerConsultationStatus.STARTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only started consultations can be completed"
    );
  }

  return WalletService.withTransaction(async (session) => {
    await WalletService.completeConsultationTransaction(requestId, session);

    const updated = await PlayerConsultationBaseService.updateById(
      requestId,
      {
        $set: {
          status: PlayerConsultationStatus.COMPLETED,
          coachFeedback: payload.coachFeedback,
        },
      },
      session
    );

    if (!updated) {
      throw new AppError(httpStatus.NOT_FOUND, "Consultation booking not found");
    }

    return updated;
  });
};

const addConsultationReview = async (
  userId: string,
  role: string,
  requestId: string,
  payload: AddConsultationReviewInput
) => {
  if (role !== ROLE.player) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only players can review consultations"
    );
  }

  const request = await getRequestForPlayer(userId, requestId);

  if (request.status !== PlayerConsultationStatus.COMPLETED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Review is allowed only after consultation is completed"
    );
  }

  if (request.isReviewed) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already reviewed this consultation"
    );
  }

  const existingReview = await RatingBaseService.findOne({
    filters: {
      author: userId,
      consultation: requestId,
      isDeleted: false,
    },
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already reviewed this consultation"
    );
  }

  const review = await RatingBaseService.create({
    author: new Types.ObjectId(userId),
    rated: new Types.ObjectId(request.coach._id.toString()),
    rating: {
      value: payload.value as 1 | 2 | 3 | 4 | 5,
      comment: payload.comment,
    },
    consultation: new Types.ObjectId(requestId),
    isDeleted: false,
  });

  await PlayerConsultationBaseService.updateById(requestId, {
    $set: { isReviewed: true },
  });

  return review;
};

export const PlayerConsultationServices = {
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultationStatus,
  startConsultation,
  updateConsultationMeeting,
  cancelConsultation,
  completeConsultation,
  addConsultationReview,
};

export default PlayerConsultationServices;
