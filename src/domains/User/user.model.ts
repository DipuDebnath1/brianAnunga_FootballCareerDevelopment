import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import validator from "validator";
import config from "../../config";
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
    phone: {
      type: String,
      trim: true,
      default: "",
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
      default: ROLE.player,
    },
    oneTimeCode: { type: Number, default: null },
    isEmailVerified: { type: Boolean, default: false },
    isResetPassword: { type: Boolean, default: false },
    fcmToken: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);


// =======================
// 🔥 INDEXES (OPTIMIZED)
// =======================

// ✅ Email unique (only for active users)
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

// ✅ Fast login query
userSchema.index({ email: 1, isDeleted: 1 });

// ✅ Optional phone login
userSchema.index({ phone: 1 }, { sparse: true });

// ✅ Role-based filtering (admin panel)
userSchema.index({ role: 1 });

// ✅ Soft delete filtering
userSchema.index({ isDeleted: 1 });

// =======================
// 🔍 STATIC METHODS
// =======================

// Check email already taken
userSchema.statics.isEmailTaken = async function (
  email: string,
  excludeUserId?: string,
) {
  const user = await this.findOne({
    email,
    isDeleted: false,
    _id: { $ne: excludeUserId },
  });
  return !!user;
};

// Check phone already taken
userSchema.statics.isPhoneNumberTaken = async function (
  phone: string,
  excludeUserId?: string,
) {
  const user = await this.findOne({
    phone,
    isDeleted: false,
    _id: { $ne: excludeUserId },
  });
  return !!user;
};


userSchema.methods.isPasswordMatch = async function (_password: string) {
  return bcrypt.compare(_password, this.password);
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});


// =======================
// 🔒 TO JSON TRANSFORM
// =======================

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete (ret as any)?.password;
    if (config.isProduction) delete (ret as any)?.oneTimeCode; // optional security
    return ret as IUser;
  },
});

const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
