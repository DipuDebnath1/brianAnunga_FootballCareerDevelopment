import mongoose, { Schema } from "mongoose";
import { IPlayerRequest, PlayerRequestStatus } from "./PlayerRequest.interface";

const playerRequestSchema = new Schema<IPlayerRequest>(
  {
    agent: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    preferredClub: { type: String, required: true },
    preferredLeagues: { type: String, required: true },
    urgencyLevel: { type: String, required: true },
    additionalInfo: { type: String, required: true },
    resume: { type: String, default: "" },
    video: { type: String, default: "" },
    status: { type: String, enum: Object.values(PlayerRequestStatus), required: true, default: PlayerRequestStatus.pending },

  },
  { timestamps: true }
);

const PlayerRequest = mongoose.model< IPlayerRequest>(
  "PlayerRequest",
  playerRequestSchema
);

export default PlayerRequest;
