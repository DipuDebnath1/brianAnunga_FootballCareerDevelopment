import mongoose from "mongoose";
import config from "./index";
import logger from "../lib/logger";

const connectionToDb = async () => {
  if (!config.database.url) {
    logger.error("DATABASE_URL is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(config.database.url);
    logger.info("MongoDB Server Connected");
  } catch (error) {
    logger.error("MongoDB connected Error", error);
    process.exit(1);
  }
};

export default connectionToDb;
