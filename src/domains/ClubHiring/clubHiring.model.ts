import mongoose, { Schema } from "mongoose";
import { ClubHiringStatus, IPlayerHiring, IPlayerHiringResponse } from "./clubHiring.interface";


const playerHiringSchema = new Schema<IPlayerHiring>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requirements: { type: String, required: true },
    facilities: { type: String, required: true },
    openPositions: { type: [String], required: true },
    positionTitle: { type: String, required: true },
    employmentType: { type: String, required: true },
    salaryRange: { type: String, required: true },
  },
  { timestamps: true }
);


const playerHiringResponseSchema = new Schema<IPlayerHiringResponse>(
  {
    clube: { type: Schema.Types.ObjectId, ref: "ClubHiring", required: true },
    position: { type: String, required: true },
    player: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    agent: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
    status: { type: String, enum: Object.values(ClubHiringStatus), required: true, default: ClubHiringStatus.PENDING },
    message: { type: String, required: true },
  },
  { timestamps: true }
);


const ClubHiring = mongoose.model<IPlayerHiring>("ClubHiring", playerHiringSchema);

export const PlayerHiringResponse = mongoose.model<IPlayerHiringResponse>("PlayerHiringResponse", playerHiringResponseSchema);

export default ClubHiring;
