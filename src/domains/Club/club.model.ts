import mongoose, { Schema } from "mongoose";
import { socialMediaSchema } from "../User/socialLinkSchema";
import { IClub } from "./club.interface";


const clubSchema = new Schema<IClub>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    about: { type: String, required: true },
    cludeName: { type: String, required: true },
    location: { type: String, required: true },
    clubeOverview: { type: String, required: true },
    playersResponded: { type: String, required: true },
    successTransfers: { type: String, required: true },
    socialMedia: socialMediaSchema,
  },
  { timestamps: true }
);

const Club = mongoose.model<IClub>("Club", clubSchema);

export default Club;
