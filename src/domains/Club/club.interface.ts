import { Document, HydratedDocument, Model, Types } from "mongoose";
import { TSocialMedia } from "../User/socialLinkSchema";


export interface IClub extends Document {
  author: Types.ObjectId;
  about: string;
  cludeName: string;
  location: string;
  clubeOverview: string;
  playersResponded: number;
  successTransfers: number;
  socialMedia: TSocialMedia;
}

export type ClubDocument = HydratedDocument<IClub>;
export type ClubModel = Model<IClub>;
