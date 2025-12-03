import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for Subscription
export interface ISubscription extends Document {
  _id: Types.ObjectId;
  planName: string;
  planPrice: number;
  duration: number; // Duration in days/months
  description: string;
  features: string[]; // Array of feature strings
}

// Interface for Testimonial
export interface ITestimonial extends Document {
  _id: Types.ObjectId;
  testimonialId: string;
  customerId: string;
  rating: number; // 1-5 scale
  comment: string;
}

// Subscription Schema
const subscriptionSchema = new Schema<ISubscription>({
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
    min: 1, // At least 1 day/month
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  features: {
    type: [String], // Array of strings
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Testimonial Schema
const testimonialSchema = new Schema<ITestimonial>({
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
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Create and export the models
export const Subscription = mongoose.model<ISubscription>("Subscription", subscriptionSchema);
export const Testimonial = mongoose.model<ITestimonial>("Testimonial", testimonialSchema);