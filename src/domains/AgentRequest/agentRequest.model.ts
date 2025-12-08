import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAMAgentRequest extends Document {
  _id: Types.ObjectId;
  agent_id: Types.ObjectId;
  user_id: Types.ObjectId;
  fullName: string;
  email_address: string;
  phone_number: number;
  age: number;
  current_position: string;
  preferred_language: string;
  preferred_club: string;
  career_goals: string;
  current_club_status: string;
  urgency_level: string;
  additional_info: string;
  resume?: string;
  video?: string;
  status: "pending" | "accept" | "decline" | "completed";
}

const agentRequestSchema = new Schema<IAMAgentRequest>(
  {
    agent_id: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Refers to the "User" model
    fullName: { type: String, required: true },
    email_address: { type: String, required: true },
    phone_number: { type: Number, required: true },
    age: { type: Number, required: true },
    current_position: { type: String, required: true },
    preferred_language: { type: String, required: true },
    preferred_club: { type: String, required: true },
    career_goals: { type: String, required: true },
    current_club_status: { type: String, required: true },
    urgency_level: { type: String, required: true },
    additional_info: { type: String, required: true },
    resume: { type: String, default: "" }, // URL or file path to the resume (optional)
    video: { type: String, default: "" }, // URL or file path to a video (optional)
    status: {
      type: String,
      enum: ["pending", "accept", "decline", "completed"],
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
);

const AgentRequest = mongoose.model<IAMAgentRequest>(
  "AgentRequest",
  agentRequestSchema
);

export default AgentRequest;
