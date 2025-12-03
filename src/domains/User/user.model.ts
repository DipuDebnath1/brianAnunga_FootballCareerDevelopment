import mongoose, { Schema, Document, Types } from "mongoose";
import { roles } from "../../config/roles";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface IAMUser extends Document {
  _id: Types.ObjectId; // Explicitly typing _id
  name: string;
  email: string;
  password: string;
  image: string;
  role: string;
  phoneNumber: string;
  oneTimeCode: number | null;
  isEmailVerified: boolean;
  isResetPassword: boolean;
  fcmToken: string;
  isDeleted: boolean;
  isPasswordMatch(password: string): Promise<boolean>; // Add this method to IAMUser interface
}

const userSchema = new Schema<IAMUser>(
  {
    name: {
      type: String,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    image: {
      type: String,
      default: "https://lpx-khalid.s3.ap-southeast-1.amazonaws.com/user.png",
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    role: {
      type: String,
      enum: roles,
      default: "user",
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    oneTimeCode: { type: Number, default: null },
    isEmailVerified: { type: Boolean, default: false },
    isResetPassword: { type: Boolean, default: false },
    fcmToken: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.methods.isPasswordMatch = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8); // Hash password with a salt of 8 rounds
  }
  next();
});

const User = mongoose.model<IAMUser>("User", userSchema);

export default User;
