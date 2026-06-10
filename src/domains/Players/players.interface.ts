import { Document, Types } from "mongoose";
import { TSocialMedia } from "../User/socialLinkSchema";

export interface IPlayer extends Document {
  author: Types.ObjectId;
  age: number;
  position: string;
  location: string;
  currentClub: string;
  currentTeam: string;
  careerToal: string;
  keySkills: string[];
  achievements: string;
  socialMedia: TSocialMedia;
  }

