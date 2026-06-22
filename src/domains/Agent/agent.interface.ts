import { Document, HydratedDocument, Model, Types } from "mongoose";
import { TSocialMedia } from "../User/socialLinkSchema";

export interface IAgent extends Document {
  author: Types.ObjectId;
  about: string;
  location: number;
  service: {
    serviceName: string;
    description: string;
  };
  areaOfExpertise: string[];
  experiences: string;
  socialMedia: TSocialMedia;
  
}

export type AgentDocument = HydratedDocument<IAgent>;
export type AgentModel = Model<IAgent>;

/** @deprecated Use IAgent instead */
export type IAMAgent = IAgent;
