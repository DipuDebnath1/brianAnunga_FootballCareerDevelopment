import mongoose from "mongoose";
import Rating, { IRating, RatingType } from "./rating.model";

// Create a new rating
const createRating = async (ratingData: Partial<IRating>) => {
  // Convert string IDs to ObjectIds if needed
  const processedRatingData = {
    ...ratingData,
    userId:
      ratingData.userId instanceof mongoose.Types.ObjectId
        ? ratingData.userId
        : new mongoose.Types.ObjectId(ratingData.userId),
    profileId:
      ratingData.profileId instanceof mongoose.Types.ObjectId
        ? ratingData.profileId
        : new mongoose.Types.ObjectId(ratingData.profileId),
  };

  // Check if user has already rated this profile
  const existingRating = await Rating.findOne({
    userId: processedRatingData.userId,
    profileId: processedRatingData.profileId,
    ratingType: processedRatingData.ratingType,
  });

  if (existingRating) {
    throw new Error("User has already rated this profile");
  }

  const rating = new Rating(processedRatingData);
  return await rating.save();
};

// Update a rating by user ID and profile ID
const updateRating = async (
  userId: string,
  profileId: string,
  ratingType: RatingType,
  updateData: Partial<IRating>
) => {
  return await Rating.findOneAndUpdate(
    {
      userId: new mongoose.Types.ObjectId(userId),
      profileId: new mongoose.Types.ObjectId(profileId),
      ratingType,
    },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

// Get rating by ID
const getRatingById = async (ratingId: string) => {
  // First get the rating to know the ratingType
  const rating = await Rating.findById(ratingId);
  if (!rating) return null;

  // Then populate based on ratingType
  if (rating.ratingType === "coach") {
    return await Rating.findById(ratingId)
      .populate("userId", "name email")
      .populate("profileId", null, "Coach");
  } else if (rating.ratingType === "agent") {
    return await Rating.findById(ratingId)
      .populate("userId", "name email")
      .populate("profileId", null, "Agent");
  }

  // Fallback: populate with userId only
  return await Rating.findById(ratingId).populate("userId", "name email");
};

// Get all ratings for a specific profile (coach or agent)
const getRatingsByProfile = async (
  profileId: string,
  ratingType: RatingType,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  if (ratingType === "coach") {
    return await Rating.find({
      profileId: new mongoose.Types.ObjectId(profileId),
      ratingType,
    })
      .populate("userId", "name email")
      .populate("profileId", null, "Coach")
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);
  } else if (ratingType === "agent") {
    return await Rating.find({
      profileId: new mongoose.Types.ObjectId(profileId),
      ratingType,
    })
      .populate("userId", "name email")
      .populate("profileId", null, "Agent")
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);
  }

  // Fallback
  return await Rating.find({
    profileId: new mongoose.Types.ObjectId(profileId),
    ratingType,
  })
    .populate("userId", "name email")
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip(skip)
    .limit(limit);
};

// Get ratings by user ID
const getRatingsByUser = async (userId: string) => {
  // Get all ratings by this user first to check their types
  const ratings = await Rating.find({
    userId: new mongoose.Types.ObjectId(userId),
  }).sort({ createdAt: -1 }); // Sort by newest first

  // Group ratings by type to make population more efficient
  const coachRatings = ratings.filter(
    (rating) => rating.ratingType === "coach"
  );
  const agentRatings = ratings.filter(
    (rating) => rating.ratingType === "agent"
  );

  // Populate in bulk by type
  const populatedCoachRatings =
    coachRatings.length > 0
      ? await Rating.find({ _id: { $in: coachRatings.map((r) => r._id) } })
          .populate("userId", "name email")
          .populate("profileId", null, "Coach")
          .sort({ createdAt: -1 })
      : [];

  const populatedAgentRatings =
    agentRatings.length > 0
      ? await Rating.find({ _id: { $in: agentRatings.map((r) => r._id) } })
          .populate("userId", "name email")
          .populate("profileId", null, "Agent")
          .sort({ createdAt: -1 })
      : [];

  // Combine and return in the original order
  const allPopulated = [...populatedCoachRatings, ...populatedAgentRatings];
  // Sort by the original order to maintain time-based sorting
  return allPopulated.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
};

// Get average rating for a specific profile
const getAverageRatingByProfile = async (
  profileId: string,
  ratingType: RatingType
) => {
  const result = await Rating.aggregate([
    {
      $match: {
        profileId: new mongoose.Types.ObjectId(profileId),
        ratingType: ratingType,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  return result.length > 0
    ? { averageRating: result[0].averageRating, count: result[0].count }
    : { averageRating: 0, count: 0 };
};

// Delete a rating by user ID and profile ID
const deleteRating = async (
  userId: string,
  profileId: string,
  ratingType: RatingType
) => {
  return await Rating.findOneAndDelete({
    userId: new mongoose.Types.ObjectId(userId),
    profileId: new mongoose.Types.ObjectId(profileId),
    ratingType,
  });
};

// Get all ratings with optional filters
const getAllRatings = async (
  ratingType?: RatingType,
  minRating?: number,
  maxRating?: number,
  page: number = 1,
  limit: number = 10
) => {
  let query: any = {};

  if (ratingType) {
    query.ratingType = ratingType;
  }

  if (minRating !== undefined) {
    query.rating = { ...query.rating, $gte: minRating };
  }

  if (maxRating !== undefined) {
    query.rating = { ...query.rating, $lte: maxRating };
  }

  const skip = (page - 1) * limit;

  // Get all ratings first to know their types
  const ratings = await Rating.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Group by ratingType for efficient population
  const coachRatings = ratings.filter(
    (rating) => rating.ratingType === "coach"
  );
  const agentRatings = ratings.filter(
    (rating) => rating.ratingType === "agent"
  );

  // Populate in bulk by type
  const populatedCoachRatings =
    coachRatings.length > 0
      ? await Rating.find({ _id: { $in: coachRatings.map((r) => r._id) } })
          .populate("userId", "name email")
          .populate("profileId", null, "Coach")
          .sort({ createdAt: -1 })
      : [];

  const populatedAgentRatings =
    agentRatings.length > 0
      ? await Rating.find({ _id: { $in: agentRatings.map((r) => r._id) } })
          .populate("userId", "name email")
          .populate("profileId", null, "Agent")
          .sort({ createdAt: -1 })
      : [];

  // Combine results
  const allPopulated = [...populatedCoachRatings, ...populatedAgentRatings];
  // Sort by the original order to maintain time-based sorting
  return allPopulated.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
};

const ratingService = {
  createRating,
  updateRating,
  getRatingById,
  getRatingsByProfile,
  getRatingsByUser,
  getAverageRatingByProfile,
  deleteRating,
  getAllRatings,
};

export default ratingService;
