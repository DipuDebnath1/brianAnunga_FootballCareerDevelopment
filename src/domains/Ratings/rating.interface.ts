import { Document, HydratedDocument, Model, Types } from "mongoose";

export type RatingType = "coach" | "agent";

export interface IRating extends Document {
  author: Types.ObjectId;
  rated: Types.ObjectId;
  rating: {
    value: 1 | 2 | 3 | 4 | 5;
    comment: string;
  };
  order: Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type RatingDocument = HydratedDocument<IRating>;
export type RatingModel = Model<IRating>;
