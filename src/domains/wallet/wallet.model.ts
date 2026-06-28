import { Schema, model } from "mongoose";
import { IWallet } from "./wallet.interface";

const ObjectId = Schema.Types.ObjectId;

const walletSchema = new Schema<IWallet>(
  {
    sender: { type: ObjectId, ref: "User", required: true },
    receiver: { type: ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    transactionId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "hold", "success", "failed", "cancelled"],
      default: "pending",
    },
    videoReviewRequest: { type: ObjectId, ref: "PlayerVideoRequest" },
    consultationRequest: { type: ObjectId, ref: "PlayerConsultationRequest" },
    description: { type: String, required: true },
    deletedBy: { type: [ObjectId], default: [] },
  },
  { timestamps: true }
);

walletSchema.index({ videoReviewRequest: 1, status: 1 });

const Wallet = model<IWallet>("Wallet", walletSchema);
export default Wallet;
