import mongoose, { Schema } from "mongoose";
import { IPlayerConsultationRequest, PlayerConsultationStatus } from "./PlayerConsultation.interface";

const playerConsultationRequestSchema = new Schema<IPlayerConsultationRequest>(
  {
    coach: { type: Schema.Types.ObjectId, ref: "Coach", required: true },
    player: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    consultationTopic: { type: String, required: true },
    bookingSlot: { type: String, required: true },
    questions: { type: String, required: true },
    meetingLink: { type: String, required: true },
    status: { type: String, enum: Object.values(PlayerConsultationStatus), required: true, default: PlayerConsultationStatus.PENDING },
    coachFeedback: { type: String, default: "" },
  },
  { timestamps: true }  
);

const PlayerConsultationRequest = mongoose.model<IPlayerConsultationRequest>(
  "PlayerConsultationRequest",
  playerConsultationRequestSchema
);

export default PlayerConsultationRequest;
