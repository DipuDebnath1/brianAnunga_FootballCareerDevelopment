import { Document, HydratedDocument, Model, Types } from "mongoose";

export const PlayerVideoRequestStatus = {
  PENDING: "pending",
  ACCEPT: "accept",
  DECLINE: "decline",
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
  playerFeedback?: string;
  status: IPlayerVideoRequestStatus;
  coachFeedback?: string;
}

export type IPlayerVideoRequestDocument = HydratedDocument<IPlayerVideoRequest>;
export type IPlayerVideoRequestModel = Model<IPlayerVideoRequest>;
