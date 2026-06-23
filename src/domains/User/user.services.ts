import httpStatus from "http-status";
import AppError from "../../ErrorHandler/AppError";
import { ROLE, TRoles } from "../../utills/roles";
import Agent from "../Agent/agent.model";
import Club from "../Club/club.model";
import coachModels from "../Coach/coach.model";
import Player from "../Players/players.model";
import { UpdateProfileInput } from "./user.validation";
import User from "./user.model";

const USER_PROFILE_SELECT =
  "-password -oneTimeCode -otpPurpose -isResetPassword -fcmToken -isDeleted";

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

const updateUserProfile = async (
  userId: string,
  updateData: UpdateProfileInput
) => {
  const user = await User.findById(userId);

  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (updateData.name) {
    user.name = updateData.name;
  }

  if (updateData.phone !== undefined) {
    user.phone = updateData.phone;
  }

  if (updateData.image) {
    user.image = updateData.image;
  }

  await user.save();

  return getUserProfile(userId);
};

const getAllUsers = async () => {
  return User.find({ isDeleted: false }).select(USER_PROFILE_SELECT);
};

export const UserServices = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
};

export default UserServices;
