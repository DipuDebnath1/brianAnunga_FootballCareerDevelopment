import { Document, HydratedDocument, Model, Types } from "mongoose";

export interface ISubscription extends Document {
  _id: Types.ObjectId;
  planName: string;
  planPrice: number;
  duration: number;
  description: string;
  features: string[];
}

export interface ITestimonial extends Document {
  _id: Types.ObjectId;
  testimonialId: string;
  customerId: string;
  rating: number;
  comment: string;
}

export type SubscriptionDocument = HydratedDocument<ISubscription>;
export type SubscriptionModel = Model<ISubscription>;
export type TestimonialDocument = HydratedDocument<ITestimonial>;
export type TestimonialModel = Model<ITestimonial>;
