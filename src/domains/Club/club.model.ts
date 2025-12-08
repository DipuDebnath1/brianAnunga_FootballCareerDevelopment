import mongoose, { Schema, Document, Types } from "mongoose";

export interface IClub extends Document {
  _id: Types.ObjectId;
  name: string;
  logo: string; // URL or path to the club logo
  description: string;
  founded: Date; // Date when the club was founded
  location: string; // Location of the club
  league: string; // Which league the club is part of
  stadium: string; // Home stadium of the club
  coach: string; // Name of the head coach
  teamColor: string[]; // Primary and secondary colors of the club
  website: string; // Official website of the club
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const clubSchema = new Schema<IClub>(
  {
    name: { type: String, required: true, unique: true },
    logo: { type: String, default: "" },
    description: { type: String, required: true },
    founded: { type: Date },
    location: { type: String, required: true },
    league: { type: String, required: true },
    stadium: { type: String, default: "" },
    coach: { type: String, default: "" },
    teamColor: [{ type: String }],
    website: { type: String, default: "" },
    socialMedia: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      youtube: { type: String },
    },
  },
  { timestamps: true }
);

const Club = mongoose.model<IClub>("Club", clubSchema);

export default Club;
