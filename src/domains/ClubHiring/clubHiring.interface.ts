import { Document, Types } from "mongoose";

export interface IPlayerHiring extends Document {
  club: Types.ObjectId;
  requirements: string;
  facilities: string;
  openPositions: string[];
  positionTitle:string
  employmentType:string
  salaryRange:string
}

export const ClubHiringStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;
export type TClubHiringStatus = (typeof ClubHiringStatus)[keyof typeof ClubHiringStatus];


export interface IPlayerHiringResponse extends Document {
  clubHiring: Types.ObjectId;
  openPosition: string;
  player: Types.ObjectId;
  agent: Types.ObjectId;
  status: TClubHiringStatus;
}