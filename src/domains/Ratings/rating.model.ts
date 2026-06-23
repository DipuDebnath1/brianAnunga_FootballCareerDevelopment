import mongoose, { Schema } from "mongoose";
import { IRating } from "./rating.interface";

const ratingSchema = new Schema<IRating>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rated: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      value: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        required: true,
        trim: true,
      },
      required: true,
      min: 1,
      max: 5,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Rating = mongoose.model<IRating>("Rating", ratingSchema);
export default Rating;
