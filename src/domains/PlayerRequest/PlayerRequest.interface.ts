import { Document, Types } from "mongoose";

export const PlayerRequestStatus = {
  pending: "pending",
  accept: "accept",
  decline: "decline",
  completed: "completed",
} as const;

export type TPlayerRequestStatus =  (typeof PlayerRequestStatus)[keyof typeof PlayerRequestStatus];

export interface IPlayerRequest extends Document {
  agent: Types.ObjectId;
  author: Types.ObjectId;
  preferredClub: string;
  preferredLeagues: string;
  urgencyLevel: string;
  additionalInfo: string;
  resume?: string;
  video?: string;
  status: TPlayerRequestStatus;
}

