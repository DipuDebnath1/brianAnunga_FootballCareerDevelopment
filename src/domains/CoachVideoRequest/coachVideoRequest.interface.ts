import { Document, HydratedDocument, Model, Types } from "mongoose";

export type CoachVideoRequestStatus =
  | "pending"
  | "accept"
  | "decline"
  | "completed";

export interface ICoachVideoRequest extends Document {
  _id: Types.ObjectId;
  coach_id: Types.ObjectId;
  user_id: Types.ObjectId;
  fullName: string;
  email_address: string;
  phone_number: number;
  age: number;
  video_title: string;
  video_description: string;
  video?: string;
  focus_on: string;
  coach_feedback?: string;
  status: CoachVideoRequestStatus;
}

export type CoachVideoRequestDocument = HydratedDocument<ICoachVideoRequest>;
export type CoachVideoRequestModel = Model<ICoachVideoRequest>;

/** @deprecated Use ICoachVideoRequest instead */
export type IAMCoachVideoRequest = ICoachVideoRequest;
