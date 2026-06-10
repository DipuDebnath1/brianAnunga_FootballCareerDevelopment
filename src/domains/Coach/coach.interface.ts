import { Document, HydratedDocument, Model, Types } from "mongoose";
import { TSocialMedia } from "../User/socialLinkSchema";

export type CoachServiceType = "video_review" | "consultation";

export interface ICoachService {
  title: string;
  description: string;
  sessionFee: number;
  preferrredTime: string;
}

export interface ICoach extends Document {
  author: Types.ObjectId;
  about: string;
  location: string;
  service: ICoachService[];
  areaOfExpertise: string[];
  coachExperiences: string;
  coachingPhilosophy: string;
  socialMedia: TSocialMedia;
}

export type CoachDocument = HydratedDocument<ICoach>;
export type CoachModel = Model<ICoach>;

/** @deprecated Use ICoach instead */
export type IAMCoach = ICoach;
