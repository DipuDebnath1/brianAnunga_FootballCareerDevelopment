import mongoose, { Schema } from "mongoose";
import { IPlayerVideoRequest, PlayerVideoRequestStatus } from "./PlayerVideoRequests.interface";

const playerVideoRequestSchema = new Schema<IPlayerVideoRequest>(
  {
    player: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coach: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    video: { type: String, required: true, validate: { validator: (value: string) => value.startsWith("https://"), message: "Video must be a valid URL" } },
    areaOfFocus: { type: String, required: true },
    status: { type: String, enum: Object.values(PlayerVideoRequestStatus), required: true, default: PlayerVideoRequestStatus.PENDING },
    coachFeedback: { type: String, default: "" },
    isReviewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PlayerVideoRequest = mongoose.model<IPlayerVideoRequest>(
  "PlayerVideoRequest",
  playerVideoRequestSchema
);

export default PlayerVideoRequest;
