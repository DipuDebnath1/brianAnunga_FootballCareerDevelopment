import mongoose, { Schema } from "mongoose";
import { socialMediaSchema } from "../User/socialLinkSchema";
import { ICoach, ICoachService } from "./coach.interface";

const coachCerviceSchema = new Schema<ICoachService>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  sessionFee: { type: Number, required: true },
  preferrredTime: { type: String, required: true },
}, {
  _id: false
});
const coachSchema = new Schema<ICoach>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    about: { type: String, required: true },
    location: { type: String, required: true },
    service: { type: [coachCerviceSchema], default: [] },
    areaOfExpertise: { type: [String], required: true },
    coachExperiences: { type: String, required: true },
    coachingPhilosophy: { type: String, required: true },
    socialMedia: socialMediaSchema,
  },
  { timestamps: true }
);

const Coach = mongoose.model<ICoach>("Coach", coachSchema);

export default Coach;
