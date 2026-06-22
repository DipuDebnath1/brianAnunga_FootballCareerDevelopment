import { Document, Types } from "mongoose";

export interface IPlayerHiring extends Document {
  author: Types.ObjectId;
  overview: string;
  requirements: string;
  facilities: string;
  openPositions: string[];
  positionTitle:string
  employmentType:string;
  salaryRange:string;
}

export const ClubHiringStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;
export type TClubHiringStatus = (typeof ClubHiringStatus)[keyof typeof ClubHiringStatus];


export interface IPlayerHiringResponse extends Document {
  clube: Types.ObjectId;
  agent: Types.ObjectId;
  player: Types.ObjectId;
  position: string;
  status: TClubHiringStatus;
  message: string;
}