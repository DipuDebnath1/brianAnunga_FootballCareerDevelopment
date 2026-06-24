import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../ErrorHandler/AppError";
import { ROLE, TRoles } from "../../utills/roles";
import Agent from "../Agent/agent.model";
import Club from "../Club/club.model";
import { default as coachModel, default as coachModels } from "../Coach/coach.model";
import Player from "../Players/players.model";
import User from "./user.model";


const profileModels = {
  coach: coachModel.Coach,
  player: Player,
  club: Club,
  agent: Agent,
};


const USER_PROFILE_SELECT =
  "-password -oneTimeCode -isResetPassword -fcmToken -isDeleted";

const getRoleProfile = async (userId: string, role: TRoles) => {
  switch (role) {
    case ROLE.player:
      return Player.findOne({ author: userId });
    case ROLE.coach:
      return coachModels.Coach.findOne({ author: userId });
    case ROLE.agents:
      return Agent.findOne({ author: userId });
    case ROLE.club:
      return Club.findOne({ author: userId });
    default:
      return null;
  }
};

const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId).select(USER_PROFILE_SELECT).lean();

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const profile = await getRoleProfile(userId, user.role as TRoles);

  return {
    user,
    profile,
  };
};

// const updateUserProfile = async (
//   userId: string,
//   updateData: UpdateProfileInput
// ) => {
//   const user = await User.findById(userId);

//   if (!user || user.isDeleted) {
//     throw new AppError(httpStatus.NOT_FOUND, "User not found");
//   }

//   if (updateData.name) {
//     user.name = updateData.name;
//   }

//   if (updateData.phone !== undefined) {
//     user.phone = updateData.phone;
//   }

//   if (updateData.image) {
//     user.image = updateData.image;
//   }

//   await user.save();

//   return getUserProfile(userId);
// };


const updateUserAndProfile = async (
  userId: string,
  payload: {
    user?: Partial<typeof User>;
    profile?: Partial<typeof profileModels[keyof typeof profileModels]>;
  } & {
    user?: Partial<typeof User>;
    profile?: Record<string, any>;
  }
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await User.findById(userId).session(session);

    if (!user || user.isDeleted) {
      throw new AppError(404, "User not found");
    }

    // // ==================
    // // Update User
    // // ==================

    // if (payload.user) {
    //   Object.assign(user, payload.user);

    //   await user.save({ session });
    // }

    // ==================
    // Update Profile
    // ==================

    let updatedProfile = null;

    const ProfileModel =
      profileModels[user.role as keyof typeof profileModels];

    console.log( payload.profile);
    if (ProfileModel && payload.profile) {
      updatedProfile = await (ProfileModel as any).findOneAndUpdate(
        { author: userId },
        {
          $set: payload.profile,
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );

      console.log(updatedProfile);
    }

    await session.commitTransaction();

    return {
      user,
      profile: updatedProfile,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};


const getAllUsers = async () => {
  return User.find({ isDeleted: false }).select(USER_PROFILE_SELECT);
};

export const UserServices = {
  getUserProfile,
  // updateUserProfile,
  updateUserAndProfile,
  getAllUsers,
};

export default UserServices;
