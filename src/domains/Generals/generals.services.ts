import {
  Subscription,
  Testimonial,
  ISubscription,
  ITestimonial,
} from "./generals.model";
import { Types } from "mongoose";

// Subscription Services
const createSubscription = async (
  subscriptionData: Omit<ISubscription, "_id">
) => {
  const subscription = new Subscription(subscriptionData);
  return await subscription.save();
};

const getAllSubscriptions = async () => {
  return await Subscription.find({});
};

const updateSubscription = async (
  id: string,
  updateData: Partial<Omit<ISubscription, "_id">>
) => {
  return await Subscription.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteSubscription = async (id: string) => {
  return await Subscription.findByIdAndDelete(id);
};

// Testimonial Services
const createTestimonial = async (
  testimonialData: Omit<ITestimonial, "_id">
) => {
  // Generate a unique testimonial ID if not provided
  if (!testimonialData.testimonialId) {
    testimonialData.testimonialId = `TESTIMONIAL-${Date.now()}`;
  }
  const testimonial = new Testimonial(testimonialData);
  return await testimonial.save();
};

const getAllTestimonials = async () => {
  return await Testimonial.find({});
};

const getTestimonialById = async (id: string) => {
  return await Testimonial.findById(id);
};

const updateTestimonial = async (
  id: string,
  updateData: Partial<Omit<ITestimonial, "_id">>
) => {
  return await Testimonial.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteTestimonial = async (id: string) => {
  return await Testimonial.findByIdAndDelete(id);
};

export default {
  // Subscription methods
  createSubscription,
  getAllSubscriptions,
  updateSubscription,
  deleteSubscription,

  // Testimonial methods
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
};
