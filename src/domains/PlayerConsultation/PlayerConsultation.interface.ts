import { Document, HydratedDocument, Model, Types } from "mongoose";

export const PlayerConsultationStatus = {
  PENDING: "pending",
  ACCEPT: "accept",
  DECLINE: "decline",
  STARTED: "started",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
} as const;
export type TPlayerConsultationStatus = (typeof PlayerConsultationStatus)[keyof typeof PlayerConsultationStatus];

export interface IPlayerConsultationRequest extends Document {
  coach: Types.ObjectId;
  player: Types.ObjectId;
  consultationTopic: string;
  bookingSlot: string;
  questions: string;
  meetingLink?: string;
  status: TPlayerConsultationStatus;
  coachFeedback?: string;
  cancelledBy?: Types.ObjectId;
  isReviewed: boolean;
}

export type IPlayerConsultationRequestDocument = HydratedDocument<IPlayerConsultationRequest>;
export type IPlayerConsultationRequestModel = Model<IPlayerConsultationRequest>;
