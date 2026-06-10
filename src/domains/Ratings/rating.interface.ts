import { Document, HydratedDocument, Model, Types } from "mongoose";

export type RatingType = "coach" | "agent";

export interface IRating extends Document {
  _id: Types.ObjectId;
  rating: number;
  review: string;
  ratingType: RatingType;
  profileId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type RatingDocument = HydratedDocument<IRating>;
export type RatingModel = Model<IRating>;
