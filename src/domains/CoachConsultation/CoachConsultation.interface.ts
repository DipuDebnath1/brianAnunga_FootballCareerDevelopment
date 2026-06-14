import { Document, HydratedDocument, Model, Types } from "mongoose";

export const CoachVideoRequestStatus = {
  PENDING: "pending",
  ACCEPT: "accept",
  DECLINE: "decline",
  COMPLETED: "completed",
} as const;
export type CoachConsultationStatus = (typeof CoachVideoRequestStatus)[keyof typeof CoachVideoRequestStatus];

export interface ICoachVideoRequest extends Document {
  coach: Types.ObjectId;
  player: Types.ObjectId;
  topic: string;
  consultationTime: Date;
  duration: string;
  questions: string;
  meetingLink: string;
  status: CoachConsultationStatus;
}

export type CoachVideoRequestDocument = HydratedDocument<ICoachVideoRequest>;
export type CoachVideoRequestModel = Model<ICoachVideoRequest>;

/** @deprecated Use ICoachVideoRequest instead */
export type IAMCoachVideoRequest = ICoachVideoRequest;
