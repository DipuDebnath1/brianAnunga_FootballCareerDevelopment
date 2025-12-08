import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAMCoachVideoRequest extends Document {
  _id: Types.ObjectId;
  coach_id: Types.ObjectId;
  user_id: Types.ObjectId;
  fullName: string;
  email_address: string;
  phone_number: number;
  age: number;
  video_title: string;
  video_description: string;
  video?: string;
  focus_on: string;
  coach_feedback?: string;
  status: "pending" | "accept" | "decline" | "completed";
}

const coachVideoRequestSchema = new Schema<IAMCoachVideoRequest>(
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

const CoachVideoRequest = mongoose.model<IAMCoachVideoRequest>(
  "CoachVideoRequest",
  coachVideoRequestSchema
);

export default CoachVideoRequest;
