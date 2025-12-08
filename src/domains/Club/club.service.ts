import Club, { IClub } from "./club.model";

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
const getClubByName = async (name: string) => {
  return await Club.findOne({ name: new RegExp(name, "i") }); // Case insensitive search
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

  return await Club.find(query).sort({ name: 1 }); // Sort alphabetically by name
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