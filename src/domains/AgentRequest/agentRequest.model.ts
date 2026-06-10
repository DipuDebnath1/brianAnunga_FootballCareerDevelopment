import mongoose, { Schema } from "mongoose";
import { IAgentRequest } from "./agentRequest.interface";

const agentRequestSchema = new Schema<IAgentRequest>(
  {
    agent_id: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
    resume: { type: String, default: "" },
    video: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "accept", "decline", "completed"],
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
);

const AgentRequest = mongoose.model<IAgentRequest>(
  "AgentRequest",
  agentRequestSchema
);

export default AgentRequest;
