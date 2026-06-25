import mongoose from "mongoose";
import config from "../config/index";
import { sampleAgentProfiles } from "../domains/Agent/agent.const";
import Agent from "../domains/Agent/agent.model";
import { sampleClubProfiles } from "../domains/Club/club.const";
import Club from "../domains/Club/club.model";
import { sampleCoachProfiles } from "../domains/Coach/coach.const";
import coachModels from "../domains/Coach/coach.model";
import { samplePlayerProfiles } from "../domains/Players/players.const";
import Player from "../domains/Players/players.model";
import { sampleUsers } from "../domains/User/user.const";
import User from "../domains/User/user.model";
import logger from "../lib/logger";


const SEED_USER_PASSWORD = '$2b$08$83RhP27I3yZDDtPsq43pNuymf10OuOxNUhbb/7g8WLobDDsjJ6t16'

const connectDB = async () => {
  if (!config.database.url) {
    logger.error("DATABASE_URL is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(config.database.url);
    logger.info("Connected to MongoDB");
  } catch (err) {
    logger.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

const dropDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    logger.info("Database dropped successfully!");
  } catch (err) {
    logger.error("Error dropping database:", err);
  }
};

const clearSeedCollections = async () => {
  await Promise.all([
    User.deleteMany({}),
    Player.deleteMany({}),
    coachModels.Coach.deleteMany({}),
    Agent.deleteMany({}),
    Club.deleteMany({}),
  ]);
  logger.info("Cleared user and profile collections");
};

const seedUsers = async () => {
  const userIdBySeedKey = new Map<string, mongoose.Types.ObjectId>();

  for (const userSeed of sampleUsers) {
    const user = await User.create({
      name: userSeed.name,
      email: userSeed.email,
      phone: userSeed.phone,
      role: userSeed.role,
      password: SEED_USER_PASSWORD,
      isEmailVerified: userSeed.isEmailVerified,
    });

    userIdBySeedKey.set(userSeed.seedKey, user._id);
  }

  logger.info(`Seeded ${sampleUsers.length} users`);
  console.log(userIdBySeedKey);
  return userIdBySeedKey;
};

const seedPlayerProfiles = async (
  userIdBySeedKey: Map<string, mongoose.Types.ObjectId>
) => {
  for (const profile of samplePlayerProfiles) {
    const author = userIdBySeedKey.get(profile.seedKey);
    if (!author) continue;

    const { seedKey: _seedKey, ...profileData } = profile;
    await Player.create({ ...profileData, author });
  }

  logger.info(`Seeded ${samplePlayerProfiles.length} player profiles`);
};

const seedCoachProfiles = async (
  userIdBySeedKey: Map<string, mongoose.Types.ObjectId>
) => {
  for (const profile of sampleCoachProfiles) {
    const author = userIdBySeedKey.get(profile.seedKey);
    if (!author) continue;

    const { seedKey: _seedKey, ...profileData } = profile;
    await coachModels.Coach.create({ ...profileData, author });
  }

  logger.info(`Seeded ${sampleCoachProfiles.length} coach profiles`);
};

const seedAgentProfiles = async (
  userIdBySeedKey: Map<string, mongoose.Types.ObjectId>
) => {
  for (const profile of sampleAgentProfiles) {
    const author = userIdBySeedKey.get(profile.seedKey);
    if (!author) continue;

    const { seedKey: _seedKey, ...profileData } = profile;
    await Agent.create({ ...profileData, author });
  }

  logger.info(`Seeded ${sampleAgentProfiles.length} agent profiles`);
};

const seedClubProfiles = async (
  userIdBySeedKey: Map<string, mongoose.Types.ObjectId>
) => {
  for (const profile of sampleClubProfiles) {
    const author = userIdBySeedKey.get(profile.seedKey);
    if (!author) continue;

    const { seedKey: _seedKey, ...profileData } = profile;
    await Club.create({ ...profileData, author });
  }

  logger.info(`Seeded ${sampleClubProfiles.length} club profiles`);
};

const seedDatabase = async () => {
  await connectDB();

  const shouldDrop = process.argv.includes("--drop");
  if (shouldDrop) {
    await dropDatabase();
  }

  logger.info(`Using seed password from SEED_USER_PASSWORD (default: 1qazxsw2)`);

  await clearSeedCollections();
  const userIdBySeedKey = await seedUsers();
  await seedPlayerProfiles(userIdBySeedKey);
  await seedCoachProfiles(userIdBySeedKey);
  await seedAgentProfiles(userIdBySeedKey);
  await seedClubProfiles(userIdBySeedKey);

  logger.info("Database seeding completed!");
  await mongoose.disconnect();
};

if (require.main === module) {
  seedDatabase().catch((err) => {
    logger.error("Seeding failed:", err);
    process.exit(1);
  });
}

export default seedDatabase;
