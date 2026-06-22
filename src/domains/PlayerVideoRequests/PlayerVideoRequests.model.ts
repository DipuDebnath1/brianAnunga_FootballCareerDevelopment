import mongoose, { Schema } from "mongoose";
import { IPlayerVideoRequest, PlayerVideoRequestStatus } from "./PlayerVideoRequests.interface";

const playerVideoRequestSchema = new Schema<IPlayerVideoRequest>(
  {
    player: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    coach: { type: Schema.Types.ObjectId, ref: "Coach", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    video: { type: String, default: "" },
    areaOfFocus: { type: String, required: true },
    playerFeedback: { type: String, default: "" },
    status: { type: String, enum: Object.values(PlayerVideoRequestStatus), required: true, default: PlayerVideoRequestStatus.PENDING },
    coachFeedback: { type: String, default: "" },
  },
  { timestamps: true }
);

const PlayerVideoRequest = mongoose.model<IPlayerVideoRequest>(
  "PlayerVideoRequest",
  playerVideoRequestSchema
);

export default PlayerVideoRequest;
