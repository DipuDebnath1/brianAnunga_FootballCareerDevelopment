import Coach from "./coach.model";
import { ICoach } from "./coach.interface";

// Create a new coach profile
const createCoachProfile = async (coachData: Partial<ICoach>) => {
  const coach = new Coach(coachData);
  return await coach.save();
};

// Update coach profile
const updateCoachProfile = async (
  coachId: string,
  updateData: Partial<ICoach>
) => {
  return await Coach.findOneAndUpdate(
    { user_id: coachId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

// Get coach by user_id
const getCoachByUserId = async (userId: string) => {
  return await Coach.findOne({ user_id: userId });
};

// Get all coaches with optional filters for area of expertise
const getAllCoaches = async (
  areaOfExpertise?: string,
  experienceYears?: number
) => {
  let query = {};

  // Add filters if provided
  if (areaOfExpertise) {
    query = { ...query, areaOfExpertise: { $in: [new RegExp(areaOfExpertise, "i")] } }; // Case insensitive search
  }

  if (experienceYears) {
    query = { ...query, experienceYears: { $gte: experienceYears } }; // Coaches with at least this many years of experience
  }

  return await Coach.find(query);
};

const coachService = {
  createCoachProfile,
  updateCoachProfile,
  getCoachByUserId,
  getAllCoaches,
};

export default coachService;
