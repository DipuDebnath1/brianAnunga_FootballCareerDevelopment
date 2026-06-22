import mongoose, { Schema } from "mongoose";
import { socialMediaSchema } from "../User/socialLinkSchema";
import { IAgent } from "./agent.interface";


const agentSchema = new Schema<IAgent>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    about: { type: String, required: true },
    location: { type: Number, required: true },
    service: {
      serviceName: { type: String, required: true },
      description: { type: String, required: true },
    },
    areaOfExpertise: { type: [String], required: true },
    experiences: { type: String, required: false, default: null },
    socialMedia: socialMediaSchema,
  },
  { timestamps: true }
);

const Agent = mongoose.model<IAgent>("Agent", agentSchema);

export default Agent;
