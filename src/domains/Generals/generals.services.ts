import { Subscription, Testimonial } from "./generals.model";
import { ISubscription, ITestimonial } from "./generals.interface";
import redis from "../../config/redis";

// Subscription Services
const createSubscription = async (
  subscriptionData: Omit<ISubscription, "_id">
) => {
  const subscription = new Subscription(subscriptionData);
  const savedSubscription = await subscription.save();

  // Clear cache after creating a new subscription
  await redis.del("subscriptions:all");

  return savedSubscription;
};

const getAllSubscriptions = async () => {
  // Check if subscriptions are cached
  const cachedSubscriptions = await redis.get("subscriptions:all");

  if (cachedSubscriptions) {
    return JSON.parse(cachedSubscriptions);
  }

  // If not cached, fetch from database
  const subscriptions = await Subscription.find({});

  // Cache the results for 1 hour (3600 seconds)
  await redis.setex("subscriptions:all", 3600, JSON.stringify(subscriptions));

  return subscriptions;
};

const getSubscriptionById = async (id: string) => {
  // Check if subscription is cached
  const cachedSubscription = await redis.get(`subscription:${id}`);

  if (cachedSubscription) {
    return JSON.parse(cachedSubscription);
  }

  // If not cached, fetch from database
  const subscription = await Subscription.findById(id);

  if (subscription) {
    // Cache the result for 1 hour (3600 seconds)
    await redis.setex(`subscription:${id}`, 3600, JSON.stringify(subscription));
  }

  return subscription;
};

const updateSubscription = async (
  id: string,
  updateData: Partial<Omit<ISubscription, "_id">>
) => {
  const updatedSubscription = await Subscription.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

  if (updatedSubscription) {
    // Update cache
    await redis.setex(
      `subscription:${id}`,
      3600,
      JSON.stringify(updatedSubscription)
    );
    // Clear the all subscriptions cache since the list changed
    await redis.del("subscriptions:all");
  }

  return updatedSubscription;
};

const deleteSubscription = async (id: string) => {
  const deletedSubscription = await Subscription.findByIdAndDelete(id);

  if (deletedSubscription) {
    // Remove from cache
    await redis.del(`subscription:${id}`);
    // Clear the all subscriptions cache since the list changed
    await redis.del("subscriptions:all");
  }

  return deletedSubscription;
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
  const savedTestimonial = await testimonial.save();

  // Clear cache after creating a new testimonial
  await redis.del("testimonials:all");

  return savedTestimonial;
};

const getAllTestimonials = async () => {
  // Check if testimonials are cached
  const cachedTestimonials = await redis.get("testimonials:all");

  if (cachedTestimonials) {
    return JSON.parse(cachedTestimonials);
  }

  // If not cached, fetch from database
  const testimonials = await Testimonial.find({});

  // Cache the results for 1 hour (3600 seconds)
  await redis.setex("testimonials:all", 3600, JSON.stringify(testimonials));

  return testimonials;
};

const getTestimonialById = async (id: string) => {
  // Check if testimonial is cached
  const cachedTestimonial = await redis.get(`testimonial:${id}`);

  if (cachedTestimonial) {
    return JSON.parse(cachedTestimonial);
  }

  // If not cached, fetch from database
  const testimonial = await Testimonial.findById(id);

  if (testimonial) {
    // Cache the result for 1 hour (3600 seconds)
    await redis.setex(`testimonial:${id}`, 3600, JSON.stringify(testimonial));
  }

  return testimonial;
};

const updateTestimonial = async (
  id: string,
  updateData: Partial<Omit<ITestimonial, "_id">>
) => {
  const updatedTestimonial = await Testimonial.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

  if (updatedTestimonial) {
    // Update cache
    await redis.setex(
      `testimonial:${id}`,
      3600,
      JSON.stringify(updatedTestimonial)
    );
    // Clear the all testimonials cache since the list changed
    await redis.del("testimonials:all");
  }

  return updatedTestimonial;
};

const deleteTestimonial = async (id: string) => {
  const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

  if (deletedTestimonial) {
    // Remove from cache
    await redis.del(`testimonial:${id}`);
    // Clear the all testimonials cache since the list changed
    await redis.del("testimonials:all");
  }

  return deletedTestimonial;
};

export default {
  // Subscription methods
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,

  // Testimonial methods
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
};
