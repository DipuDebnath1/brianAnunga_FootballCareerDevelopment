import { Document, HydratedDocument, Model, Types } from "mongoose";

export const PlayerVideoRequestStatus = {
  PENDING: "pending",
  ACCEPT: "accept",
  DECLINE: "decline",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
} as const;
export type IPlayerVideoRequestStatus = (typeof PlayerVideoRequestStatus)[keyof typeof PlayerVideoRequestStatus];

export interface IPlayerVideoRequest extends Document {
  coach: Types.ObjectId;
  player: Types.ObjectId;
  title: string;
  description: string;
  video?: string;
  areaOfFocus: string;
  status: IPlayerVideoRequestStatus;
  cancelledBy?: Types.ObjectId;
  coachFeedback?: string;
  isReviewed: boolean;
}

export type IPlayerVideoRequestDocument = HydratedDocument<IPlayerVideoRequest>;
export type IPlayerVideoRequestModel = Model<IPlayerVideoRequest>;
