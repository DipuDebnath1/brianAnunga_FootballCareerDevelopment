import { Document, HydratedDocument, Model, Types } from "mongoose";
import { TSocialMedia } from "../User/socialLinkSchema";

export type CoachServiceType = "video_review" | "consultation";

 
export const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type DayOfWeek = (typeof daysOfWeek)[number];


export interface ITimeSlot extends Document {
  day: DayOfWeek;
  startTime: Date;
  endTime: Date;
}

export interface ICoachService {
  title: string;
  description: string;
}

export interface ICoach extends Document {
  author: Types.ObjectId;
  about: string;
  location: string;
  service: ICoachService;
  consultationFee: number;
  videoReviewFee: number;
  areaOfExpertise: string[];
  coachExperiences: string;
  coachingPhilosophy: string;
  socialMedia: TSocialMedia;
}

export type CoachDocument = HydratedDocument<ICoach>;
export type CoachModel = Model<ICoach>;

/** @deprecated Use ICoach instead */
export type IAMCoach = ICoach;
