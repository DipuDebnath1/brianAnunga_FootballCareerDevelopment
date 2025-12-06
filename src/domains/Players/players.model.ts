import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAMPlayer extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  fullName: string;
  profilePhoto: string;
  age: number;
  position: string;
  location: string;
  phone: string;
  email: string;
  current_team: string;
  current_club: string;
  career_goal: string;
  key_skills: string[];
  achievements: string;
  facebook_link?: string;
  twitter_link?: string;
  instagram_link?: string;
  linkedin_link?: string;
}

const playerSchema = new Schema<IAMPlayer>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    profilePhoto: { type: String, default: "" },
    age: { type: Number, required: true },
    position: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    current_team: { type: String, default: "" },
    current_club: { type: String, default: "" },
    career_goal: { type: String, default: "" },
    key_skills: [{ type: String }],
    achievements: { type: String, default: "" },
    facebook_link: { type: String, default: "" },
    twitter_link: { type: String, default: "" },
    instagram_link: { type: String, default: "" },
    linkedin_link: { type: String, default: "" },
  },
  { timestamps: true }
);

const Player = mongoose.model<IAMPlayer>("Player", playerSchema);

export default Player;
