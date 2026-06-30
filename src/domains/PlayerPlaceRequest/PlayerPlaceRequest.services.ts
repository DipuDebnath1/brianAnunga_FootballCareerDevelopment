import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../ErrorHandler/AppError";
import {
  AgentBaseService,
  PlayerPlacementBaseService,
} from "../../service";
import { ROLE } from "../../utills/roles";
import {
  PlayerPlacementStatus,
  TPlayerPlacementStatus,
} from "./PlayerPlaceRequest.interface";
import {
  CreatePlacementInput,
  UpdatePlacementStatusInput,
} from "./PlayerPlaceRequest.validation";

const getRequestForPlayer = async (userId: string, requestId: string) => {
  const request = await PlayerPlacementBaseService.findById(requestId);

  if (!request || request.author.toString() !== userId) {
    throw new AppError(httpStatus.NOT_FOUND, "Placement request not found");
  }

  return request;
};

const getRequestForAgent = async (userId: string, requestId: string) => {
  const request = await PlayerPlacementBaseService.findById(requestId);

  if (!request || request.agent.toString() !== userId) {
    throw new AppError(httpStatus.NOT_FOUND, "Placement request not found");
  }

  return request;
};

const createPlacement = async (
  userId: string,
  role: string,
  payload: CreatePlacementInput,
  resumeUrl: string
) => {
  if (role !== ROLE.player) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only players can create placement requests"
    );
  }

  if (!resumeUrl) {
    throw new AppError(httpStatus.BAD_REQUEST, "Resume file is required");
  }

  const agent = await AgentBaseService.findOne({
    filters: { author: payload.agentId },
  });

  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }

  return PlayerPlacementBaseService.create({
    agent: new Types.ObjectId(payload.agentId),
    author: new Types.ObjectId(userId),
    preferredClub: payload.preferredClub,
    preferredLeagues: payload.preferredLeagues,
    urgencyLevel: payload.urgencyLevel,
    additionalInfo: payload.additionalInfo,
    resume: resumeUrl,
    video: payload.video,
    status: PlayerPlacementStatus.pending,
  });
};

const getPlacements = async (
  userId: string,
  role: string,
  status?: TPlayerPlacementStatus
) => {
  const filters: Record<string, unknown> = {};

  if (role === ROLE.player) {
    filters.author = userId;
  } else if (role === ROLE.agents) {
    filters.agent = userId;
  } else {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden");
  }

  if (status) {
    filters.status = status;
  }

  return PlayerPlacementBaseService.findMany({
    filters,
    sort: { createdAt: -1 },
  });
};

const getPlacementById = async (
  userId: string,
  role: string,
  requestId: string
) => {
  if (role === ROLE.player) {
    return getRequestForPlayer(userId, requestId);
  }

  if (role === ROLE.agents) {
    return getRequestForAgent(userId, requestId);
  }

  throw new AppError(httpStatus.FORBIDDEN, "Forbidden");
};

const updatePlacementStatus = async (
  userId: string,
  role: string,
  requestId: string,
  payload: UpdatePlacementStatusInput
) => {
  if (role !== ROLE.agents) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only agents can accept or decline placement requests"
    );
  }

  const request = await getRequestForAgent(userId, requestId);

  if (request.status !== PlayerPlacementStatus.pending) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Only pending placement requests can be accepted or declined"
    );
  }

  const updated = await PlayerPlacementBaseService.updateById(requestId, {
    $set: { status: payload.status },
  });

  if (!updated) {
    throw new AppError(httpStatus.NOT_FOUND, "Placement request not found");
  }

  return updated;
};

export const PlayerPlaceRequestServices = {
  createPlacement,
  getPlacements,
  getPlacementById,
  updatePlacementStatus,
};

export default PlayerPlaceRequestServices;
