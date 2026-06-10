import Player from "./players.model";
import { IPlayer } from "./players.interface";

// Create a new player profile
const createPlayerProfile = async (playerData: Partial<IPlayer>) => {
  const player = new Player(playerData);
  return await player.save();
};

// Update player profile
const updatePlayerProfile = async (
  playerId: string,
  updateData: Partial<IPlayer>
) => {
  return await Player.findOneAndUpdate(
    { user_id: playerId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

// Get all players with optional filters for position, location, and key skills
const getAllPlayers = async (
  position?: string,
  location?: string,
  keySkills?: string[]
) => {
  let query = {};

  // Add filters if provided
  if (position) {
    query = { ...query, position: new RegExp(position, "i") }; // Case insensitive search
  }

  if (location) {
    query = { ...query, location: new RegExp(location, "i") }; // Case insensitive search
  }

  if (keySkills && keySkills.length > 0) {
    // Search for players who have any of the specified skills
    query = {
      ...query,
      key_skills: { $in: keySkills.map((skill) => new RegExp(skill, "i")) },
    };
  }

  return await Player.find(query);
};

const playerService = {
  createPlayerProfile,
  updatePlayerProfile,
  getAllPlayers,
};

export default playerService;
