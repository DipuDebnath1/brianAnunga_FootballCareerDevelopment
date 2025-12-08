import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for Coach Services
interface CoachServices {
  serviceName: string;
  description: string;
  price: number;
  durations: string;
  type: "video_review" | "consultation";
  link?: string;
}

export interface IAMCoach extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  fullName: string;
  profilePhoto: string;
  experienceYears: number;
  about: string;
  areaOfExpertise: string[];
  coachingExperiences: string;
  coachingPhilosophy: string;
  servicesOffered: CoachServices[];
  facebook_link: string;
  twitter_link: string;
  instagram_link: string;
  linkedin_link: string;
}

const coachSchema = new Schema<IAMCoach>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Refers to the "User" model (assuming user is another collection in your app)
    fullName: { type: String, required: true },
    profilePhoto: { type: String, default: "" },
    experienceYears: { type: Number, required: true },
    about: { type: String, required: true },
    areaOfExpertise: [{ type: String, required: true }],
    coachingExperiences: { type: String, required: true },
    coachingPhilosophy: { type: String, required: true },
    servicesOffered: [
      {
        serviceName: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        durations: { type: String, required: true },
        type: {
          type: String,
          enum: ["video_review", "consultation"],
          required: true,
        },
        link: { type: String, default: "" },
      },
    ],
    facebook_link: { type: String, default: "" },
    twitter_link: { type: String, default: "" },
    instagram_link: { type: String, default: "" },
    linkedin_link: { type: String, default: "" },
  },
  { timestamps: true }
);

const Coach = mongoose.model<IAMCoach>("Coach", coachSchema);

export default Coach;
