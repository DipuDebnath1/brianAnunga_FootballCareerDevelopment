import mongoose, { Schema, Document, Types } from "mongoose";

export type RatingType = "coach" | "agent";

export interface IRating extends Document {
  _id: Types.ObjectId;
  rating: number; // 1-5 rating
  review: string; // Review text
  ratingType: RatingType; // Type of profile being rated
  profileId: Types.ObjectId; // ID of the coach/agent being rated
  userId: Types.ObjectId; // ID of the user who gave the rating
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<IRating>(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    ratingType: {
      type: String,
      enum: ["coach", "agent"],
      required: true,
    },
    profileId: {
      type: Schema.Types.ObjectId,
      refPath: 'ratingType', // Dynamically references either Coach or Agent based on ratingType
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Index for efficient querying by profileId and ratingType
ratingSchema.index({ profileId: 1, ratingType: 1 });
// Index for querying by userId
ratingSchema.index({ userId: 1 });

const Rating = mongoose.model<IRating>("Rating", ratingSchema);

export default Rating;