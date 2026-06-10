import mongoose, { Schema } from "mongoose";
import { ISubscription, ITestimonial } from "./generals.interface";

const subscriptionSchema = new Schema<ISubscription>(
  {
    planName: {
      type: String,
      required: true,
      trim: true,
    },
    planPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    features: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const testimonialSchema = new Schema<ITestimonial>(
  {
    testimonialId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customerId: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
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
  },
  { timestamps: true }
);

export const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
export const Testimonial = mongoose.model<ITestimonial>(
  "Testimonial",
  testimonialSchema
);
