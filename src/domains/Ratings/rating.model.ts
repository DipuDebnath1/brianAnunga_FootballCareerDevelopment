import mongoose, { Schema } from "mongoose";
import { IRating } from "./rating.interface";

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
      refPath: "ratingType",
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

ratingSchema.index({ profileId: 1, ratingType: 1 });
ratingSchema.index({ userId: 1 });

const Rating = mongoose.model<IRating>("Rating", ratingSchema);

export default Rating;
