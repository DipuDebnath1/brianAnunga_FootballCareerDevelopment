import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../ErrorHandler/AppError";
import {
  CoachBaseService,
  PlayerVideoRequestBaseService,
  RatingBaseService,
} from "../../service";
import { ROLE } from "../../utills/roles";
import {
  IPlayerVideoRequestStatus,
  PlayerVideoRequestStatus,
} from "./PlayerVideoRequests.interface";
import {
  AddVideoReviewInput,
  CompleteVideoRequestInput,
  CreateVideoRequestInput,
  UpdateRequestStatusInput,
} from "./PlayerVideoRequests.validation";

const getRequestForPlayer = async (userId: string, requestId: string) => {
  const request = await PlayerVideoRequestBaseService.findById(requestId);

  if (!request || request.player.toString() !== userId) {
    throw new AppError(httpStatus.NOT_FOUND, "Video request not found");
  }

  return request;
};

const getRequestForCoach = async (userId: string, requestId: string) => {
  const request = await PlayerVideoRequestBaseService.findById(requestId);

  if (!request || request.coach.toString() !== userId) {
    throw new AppError(httpStatus.NOT_FOUND, "Video request not found");
  }

  return request;
};

const createVideoRequest = async (
  userId: string,
  role: string,
  payload: CreateVideoRequestInput
) => {
  if (role !== ROLE.player) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only players can create video analysis requests"
    );
  }

  const coach = await CoachBaseService.findOne({
    filters: { author: payload.coach },
    select: "isAvailable",
  });

  if (!coach) {
    throw new AppError(httpStatus.NOT_FOUND, "Coach not found");
  }

  if (!coach.isAvailable) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Coach is not available right now"
    );
  }

  return PlayerVideoRequestBaseService.create({
    player: new Types.ObjectId(userId),
    coach: new Types.ObjectId(payload.coach),
    title: payload.title,
    description: payload.description,
    video: payload.video,
    areaOfFocus: payload.areaOfFocus,
    status: PlayerVideoRequestStatus.PENDING,
    isReviewed: false,
  });
};

const getVideoRequests = async (
  userId: string,
  role: string,
  status?: IPlayerVideoRequestStatus
) => {
  const filters: Record<string, unknown> = {};

  if (role === ROLE.player) {
    filters.player = userId;
  } else if (role === ROLE.coach) {
    filters.coach = userId;
  } else {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden");
  }

  if (status) {
    filters.status = status;
  }

  return PlayerVideoRequestBaseService.findMany({
    filters,
    sort: { createdAt: -1 },
  });
};

const getVideoRequestById = async (
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

const updateRequestStatus = async (
  userId: string,
  role: string,
  requestId: string,
  payload: UpdateRequestStatusInput
) => {
  if (role !== ROLE.coach) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only coaches can accept or decline requests"
    );
  }

  const request = await getRequestForCoach(userId, requestId);

  if (request.status !== PlayerVideoRequestStatus.PENDING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only pending requests can be accepted or declined"
    );
  }

  const updated = await PlayerVideoRequestBaseService.updateById(requestId, {
    $set: { status: payload.status },
  });

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Video request not found");
  }

  return updated;
};

const completeVideoRequest = async (
  userId: string,
  role: string,
  requestId: string,
  payload: CompleteVideoRequestInput
) => {
  if (role !== ROLE.coach) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only coaches can complete video analysis"
    );
  }

  const request = await getRequestForCoach(userId, requestId);

  if (request.status !== PlayerVideoRequestStatus.ACCEPT) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only accepted requests can be completed"
    );
  }

  const updated = await PlayerVideoRequestBaseService.updateById(requestId, {
    $set: {
      status: PlayerVideoRequestStatus.COMPLETED,
      coachFeedback: payload.coachFeedback,
    },
  });

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Video request not found");
  }

  return updated;
};

const addVideoReview = async (
  userId: string,
  role: string,
  requestId: string,
  payload: AddVideoReviewInput
) => {
  if (role !== ROLE.player) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only players can review video analysis"
    );
  }

  const request = await getRequestForPlayer(userId, requestId);

  if (request.status !== PlayerVideoRequestStatus.COMPLETED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Review is allowed only after analysis is completed"
    );
  }

  if (request.isReviewed) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already reviewed this video analysis"
    );
  }

  const existingReview = await RatingBaseService.findOne({
    filters: {
      author: userId,
      videoReview: requestId,
      isDeleted: false,
    },
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already reviewed this video analysis"
    );
  }

  const review = await RatingBaseService.create({
    author: new Types.ObjectId(userId),
    rated: new Types.ObjectId(request.coach.toString()),
    rating: {
      value: payload.value as 1 | 2 | 3 | 4 | 5,
      comment: payload.comment,
    },
    videoReview: new Types.ObjectId(requestId),
    isDeleted: false,
  });

  await PlayerVideoRequestBaseService.updateById(requestId, {
    $set: { isReviewed: true },
  });

  return review;
};

export const PlayerVideoRequestsServices = {
  createVideoRequest,
  getVideoRequests,
  getVideoRequestById,
  updateRequestStatus,
  completeVideoRequest,
  addVideoReview,
};

export default PlayerVideoRequestsServices;
