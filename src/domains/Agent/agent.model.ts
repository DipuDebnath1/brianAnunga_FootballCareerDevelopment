import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for Coach Services
interface AgentServices {
  serviceName: string;
  description: string;
  link?: string;
}

export interface IAMAgent extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  fullName: string;
  profilePhoto: string;
  experienceYears: number;
  about: string;
  areaOfExpertise: string[];
  coachingExperiences: string;
  coachingPhilosophy: string;
  servicesOffered: AgentServices[];
  facebook_link: string;
  twitter_link: string;
  instagram_link: string;
  linkedin_link: string;
}

const agentSchema = new Schema<IAMAgent>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Refers to the "User" model (assuming user is another collection in your app)
    fullName: { type: String, required: true },
    profilePhoto: { type: String, default: "" },
    experienceYears: { type: Number, required: true },
    about: { type: String, required: true },
    areaOfExpertise: [{ type: String, required: true }],
    coachingExperiences: { type: String, required: true },
    coachingPhilosophy: { type: String, required: true },
    servicesOffered: [
      {
        serviceName: { type: String, required: true },
        description: { type: String, required: true },
        link: { type: String, default: "" },
      },
    ],
    facebook_link: { type: String, default: "" },
    twitter_link: { type: String, default: "" },
    instagram_link: { type: String, default: "" },
    linkedin_link: { type: String, default: "" },
  },
  { timestamps: true }
);

const Agent = mongoose.model<IAMAgent>("Agent", agentSchema);

export default Agent;
