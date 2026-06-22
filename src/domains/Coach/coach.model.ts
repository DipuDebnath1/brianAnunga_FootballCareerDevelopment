import mongoose, { Schema } from "mongoose";
import { socialMediaSchema } from "../User/socialLinkSchema";
import { daysOfWeek, ICoach, ITimeSlot } from "./coach.interface";


const timeSlotSchema = new Schema<ITimeSlot>({
  day: { type: String, enum: daysOfWeek, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});


const coachSchema = new Schema<ICoach>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    about: { type: String, required: true },
    location: { type: String, required: true },
    service: {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
    consultationFee: { type: Number, required: true },
    videoReviewFee: { type: Number, required: true },
    areaOfExpertise: { type: [String], required: true },
    coachExperiences: { type: String, required: true },
    coachingPhilosophy: { type: String, required: true },
    socialMedia: socialMediaSchema,
  },
  { timestamps: true }
);

const Coach = mongoose.model<ICoach>("Coach", coachSchema);
const TimeSlot = mongoose.model<ITimeSlot>("TimeSlot", timeSlotSchema);

export default { Coach, TimeSlot };
