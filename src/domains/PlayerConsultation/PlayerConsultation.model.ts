import mongoose, { Schema } from "mongoose";
import { IPlayerConsultationRequest, PlayerConsultationStatus } from "./PlayerConsultation.interface";

const playerConsultationRequestSchema = new Schema<IPlayerConsultationRequest>(
  {
    coach: { type: Schema.Types.ObjectId, ref: "User", required: true },
    player: { type: Schema.Types.ObjectId, ref: "User", required: true },
    consultationTopic: { type: String, required: true },
    bookingSlot: { type: String, required: true },
    questions: { type: String, required: true },
    meetingLink: { type: String, required: false },
    status: { type: String, enum: Object.values(PlayerConsultationStatus), required: true, default: PlayerConsultationStatus.PENDING },
    coachFeedback: { type: String, default: "" },
    cancelledBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    isReviewed: { type: Boolean, default: false },
  },
  { timestamps: true }  
);

const PlayerConsultationRequest = mongoose.model<IPlayerConsultationRequest>(
  "PlayerConsultationRequest",
  playerConsultationRequestSchema
);

export default PlayerConsultationRequest;
