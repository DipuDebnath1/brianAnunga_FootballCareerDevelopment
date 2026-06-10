import Club from "./club.model";
import { IClub } from "./club.interface";

// Create a new club
const createClub = async (clubData: Partial<IClub>) => {
  const club = new Club(clubData);
  return await club.save();
};

// Update club by ID
const updateClub = async (
  clubId: string,
  updateData: Partial<IClub>
) => {
  return await Club.findByIdAndUpdate(
    clubId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

// Get club by ID
const getClubById = async (clubId: string) => {
  return await Club.findById(clubId);
};

// Get club by name
const getClubByName = async (clubName: string) => {
  return await Club.findOne({ clubName: new RegExp(clubName, "i") });
};

// Get all clubs with optional filters
const getAllClubs = async (
  league?: string,
  location?: string
) => {
  let query = {};

  // Add filters if provided
  if (league) {
    query = { ...query, league: new RegExp(league, "i") }; // Case insensitive search
  }

  if (location) {
    query = { ...query, location: new RegExp(location, "i") }; // Case insensitive search
  }

  return await Club.find(query).sort({ clubName: 1 });
};

// Delete club by ID
const deleteClub = async (clubId: string) => {
  return await Club.findByIdAndDelete(clubId);
};

const clubService = {
  createClub,
  updateClub,
  getClubById,
  getClubByName,
  getAllClubs,
  deleteClub,
};

export default clubService;