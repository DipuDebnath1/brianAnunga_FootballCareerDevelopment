import { Document, HydratedDocument, Model, Types } from "mongoose";

export type AgentRequestStatus = "pending" | "accept" | "decline" | "completed";

export interface IAgentRequest extends Document {
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
  status: AgentRequestStatus;
}

export type AgentRequestDocument = HydratedDocument<IAgentRequest>;
export type AgentRequestModel = Model<IAgentRequest>;

/** @deprecated Use IAgentRequest instead */
export type IAMAgentRequest = IAgentRequest;
