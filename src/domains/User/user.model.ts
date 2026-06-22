import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import validator from "validator";
import { AllRoles, ROLE } from "../../utills/roles";
import { IUser, IUserMethods, UserModel } from "./user.interface";

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
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
            "Password must contain at least one letter and one number",
          );
        }
      },
    },
    role: {
      type: String,
      enum: Object.keys(AllRoles),
      default: ROLE.user,
    },
    oneTimeCode: { type: Number, default: null },
    otpPurpose: {
      type: String,
      enum: ["verify", "reset", null],
      default: null,
    },
    isEmailVerified: { type: Boolean, default: false },
    isResetPassword: { type: Boolean, default: false },
    fcmToken: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.methods.isPasswordMatch = async function (_password: string) {
  return bcrypt.compare(_password, this.password);
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
