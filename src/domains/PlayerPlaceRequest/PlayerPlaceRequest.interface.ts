import { Document, Types } from "mongoose";

export const PlayerPlacementStatus = {
  pending: "pending",
  accept: "accept",
  decline: "decline",
  completed: "completed",
} as const;

export type TPlayerPlacementStatus =  (typeof PlayerPlacementStatus)[keyof typeof PlayerPlacementStatus];

export interface IPlayerPlacement extends Document {
  agent: Types.ObjectId;
  author: Types.ObjectId;
  preferredClub: string;
  preferredLeagues: string;
  urgencyLevel: string;
  additionalInfo: string;
  resume?: string;
  video?: string;
  status: TPlayerPlacementStatus;
}

