import mongoose, { Schema } from "mongoose";
import { ICoachVideoRequest } from "./coachVideoRequest.interface";

const coachVideoRequestSchema = new Schema<ICoachVideoRequest>(
  {
    coach_id: { type: Schema.Types.ObjectId, ref: "Coach", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    email_address: { type: String, required: true },
    phone_number: { type: Number, required: true },
    age: { type: Number, required: true },
    video_title: { type: String, required: true },
    video_description: { type: String, required: true },
    video: { type: String, default: "" },
    focus_on: { type: String, required: true },
    coach_feedback: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "accept", "decline", "completed"],
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
);

const CoachVideoRequest = mongoose.model<ICoachVideoRequest>(
  "CoachVideoRequest",
  coachVideoRequestSchema
);

export default CoachVideoRequest;
