import { Document, HydratedDocument, Model, Types } from "mongoose";

export const PlayerConsultationStatus = {
  PENDING: "pending",
  ACCEPT: "accept",
  DECLINE: "decline",
  COMPLETED: "completed",
} as const;
export type TPlayerConsultationStatus = (typeof PlayerConsultationStatus)[keyof typeof PlayerConsultationStatus];

export interface IPlayerConsultationRequest extends Document {
  coach: Types.ObjectId;
  player: Types.ObjectId;
  consultationTopic: string;
  bookingSlot: string;
  questions: string;
  meetingLink: string;
  status: TPlayerConsultationStatus;
  coachFeedback?: string;
}

export type IPlayerConsultationRequestDocument = HydratedDocument<IPlayerConsultationRequest>;
export type IPlayerConsultationRequestModel = Model<IPlayerConsultationRequest>;
