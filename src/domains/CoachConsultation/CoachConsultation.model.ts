import mongoose, { Schema } from "mongoose";
import { CoachVideoRequestStatus, ICoachVideoRequest } from "./CoachConsultation.interface";

const coachVideoRequestSchema = new Schema<ICoachVideoRequest>(
  {
    coach: { type: Schema.Types.ObjectId, ref: "Coach", required: true },
    player: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    video: { type: String, default: "" },
    areaOfFocus: { type: String, required: true },
    coachFeedback: { type: String, default: "" },
    status: { type: String, enum: Object.values(CoachVideoRequestStatus), required: true, default: CoachVideoRequestStatus.PENDING },
  },
  { timestamps: true }
);

const CoachVideoRequest = mongoose.model<ICoachVideoRequest>(
  "CoachVideoRequest",
  coachVideoRequestSchema
);

export default CoachVideoRequest;
