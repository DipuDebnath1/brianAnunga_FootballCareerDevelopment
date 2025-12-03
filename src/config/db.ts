import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const MongodbURL = process.env.DATABASE_URL;

const connectionToDb = async () => {
  console.log(MongodbURL, "mongodb URL");
  if (!MongodbURL) {
    process.exit(1);
  }
  try {
    await mongoose.connect(MongodbURL);
    console.log("MongoDB Server Connected");
  } catch (error) {
    console.error("MongoDB connected Error", error);
    process.exit(1);
  }
};

export default connectionToDb;
