import Agent, { IAMAgent } from "./club.model";

// Create a new agent profile
const createAgentProfile = async (agentData: Partial<IAMAgent>) => {
  const agent = new Agent(agentData);
  return await agent.save();
};

// Update agent profile
const updateAgentProfile = async (
  agentId: string,
  updateData: Partial<IAMAgent>
) => {
  return await Agent.findOneAndUpdate(
    { user_id: agentId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

// Get agent by user_id
const getAgentByUserId = async (userId: string) => {
  return await Agent.findOne({ user_id: userId });
};

// Get all agents with optional filters for area of expertise
const getAllAgents = async (
  areaOfExpertise?: string,
  experienceYears?: number
) => {
  let query = {};

  // Add filters if provided
  if (areaOfExpertise) {
    query = {
      ...query,
      areaOfExpertise: { $in: [new RegExp(areaOfExpertise, "i")] },
    }; // Case insensitive search
  }

  if (experienceYears) {
    query = { ...query, experienceYears: { $gte: experienceYears } }; // Agents with at least this many years of experience
  }

  return await Agent.find(query);
};

const agentService = {
  createAgentProfile,
  updateAgentProfile,
  getAgentByUserId,
  getAllAgents,
};

export default agentService;
