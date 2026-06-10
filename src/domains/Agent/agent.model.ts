import mongoose, { Schema } from "mongoose";
import { AgentService, IAgent } from "./agent.interface";
import { socialMediaSchema } from "../User/socialLinkSchema";

const agentServiceSchema = new Schema<AgentService>({
  serviceName: { type: String, required: true },
  description: { type: String, required: true },
}, {
  _id: false
});

const agentSchema = new Schema<IAgent>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    about: { type: String, required: true },
    location: { type: Number, required: true },
    service: { type: [agentServiceSchema], default: [] },
    areaOfExpertise: { type: [String], required: true },
    experiences: { type: String, required: true },
    socialMedia: socialMediaSchema,
  },
  { timestamps: true }
);

const Agent = mongoose.model<IAgent>("Agent", agentSchema);

export default Agent;
