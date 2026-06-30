import mongoose, { Schema } from "mongoose";
import { IPlayerPlacement, PlayerPlacementStatus } from "./PlayerPlaceRequest.interface";

const playerPlacementSchema = new Schema<IPlayerPlacement>(
  {
    agent: { type: Schema.Types.ObjectId, ref: "User", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    preferredClub: { type: String, required: true },
    preferredLeagues: { type: String, required: true },
    urgencyLevel: { type: String, required: true },
    additionalInfo: { type: String, required: true },
    resume: { type: String, default: "" },
    video: { type: String, default: "" },
    status: { type: String, enum: Object.values(PlayerPlacementStatus), required: true, default: PlayerPlacementStatus.pending },

  },
  { timestamps: true }
);

const PlayerPlacement = mongoose.model< IPlayerPlacement>(
  "PlayerPlacement",
  playerPlacementSchema
);

export default PlayerPlacement;
 