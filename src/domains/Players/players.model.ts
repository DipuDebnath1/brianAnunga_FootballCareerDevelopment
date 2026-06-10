import mongoose, { Schema } from "mongoose";
import { socialMediaSchema } from "../User/socialLinkSchema";
import { IPlayer } from "./players.interface";

const playerSchema = new Schema<IPlayer>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    age: { type: Number, required: true },
    position: { type: String, required: true },
    location: { type: String, required: true },
    currentClub: { type: String, required: true },
    currentTeam: { type: String, required: true },
    careerToal: { type: String, required: true },
    keySkills: { type: [String], required: true },
    achievements: { type: String, required: true },
    socialMedia: socialMediaSchema,
  },
  { timestamps: true }
);

const Player = mongoose.model<IPlayer>("Player", playerSchema);

export default Player;
