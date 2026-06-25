import httpStatus from "http-status";
import mongoose, { FilterQuery } from "mongoose";
import AppError from "../../ErrorHandler/AppError";
import { TRoles } from "../../utills/roles";
import userProfileService, { UserProfileService } from "./user.profile.service";
import { IUser } from "./user.interface";
import User from "./user.model";
import {
  DEFAULT_USER_SELECT,
  USER_IMAGE_UPDATE_SELECT,
} from "./user.utils";

export type GetUserWithProfileOptions = {
  userSelect?: string;
  profileSelect?: string;
};

export type GetAllUsersOptions = {
  name?: string;
  email?: string;
  role?: TRoles;
  select?: string;
};

const toMongooseSelect = (select: string | undefined, fallback: string) => {
  if (!select?.trim()) {
    return fallback;
  }

  return select.trim().replace(/,/g, " ");
};

const parseRequestedFields = (select?: string) => {
  if (!select?.trim()) {
    return null;
  }

  return new Set(
    select
      .split(",")
      .map((field) => field.trim())
      .filter(Boolean)
  );
};

const buildUserSelectForProfile = (userSelect?: string) => {
  const select = toMongooseSelect(userSelect, DEFAULT_USER_SELECT);

  if (select.split(/\s+/).includes("role")) {
    return select;
  }

  return `${select} role`;
};

const pickUserFields = <T extends Record<string, unknown>>(
  user: T,
  requestedFields: Set<string> | null
) => {
  if (!requestedFields) {
    return user;
  }

  return Object.fromEntries(
    Object.entries(user).filter(([key]) => requestedFields.has(key))
  ) as T;
};

const buildUserSearchQuery = (
  filter: Pick<GetAllUsersOptions, "name" | "email" | "role">
): FilterQuery<IUser> => {
  const query: FilterQuery<IUser> = { isDeleted: false };

  if (filter.name?.trim()) {
    query.name = { $regex: filter.name.trim(), $options: "i" };
  }

  if (filter.email?.trim()) {
    query.email = { $regex: filter.email.trim(), $options: "i" };
  }

  if (filter.role) {
    query.role = filter.role;
  }

  return query;
};

const getUserWithProfile = async (
  userId: string,
  options: GetUserWithProfileOptions = {}
) => {
  const requestedFields = parseRequestedFields(options.userSelect);

  const user = await User.findOne({ _id: userId, isDeleted: false })
    .select(buildUserSelectForProfile(options.userSelect))
    .lean();

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const profile = await userProfileService.findRoleProfile(
    user.role as TRoles,
    { author: userId },
    options.profileSelect
  );

  return {
    user: pickUserFields(user, requestedFields),
    profile,
  };
};

const getAllUsers = async (options: GetAllUsersOptions = {}) => {
  const { select, ...search } = options;

  return User.find(buildUserSearchQuery(search)).select(
    toMongooseSelect(select, DEFAULT_USER_SELECT)
  );
};

const getSingleUser = async (
  userId: string,
  options: GetUserWithProfileOptions = {}
) => {
  return getUserWithProfile(userId, options);
};

const updateUserImage = async (userId: string, imagePath: string) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { image: imagePath },
    { new: true, runValidators: true }
  ).select(USER_IMAGE_UPDATE_SELECT);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const updateUserAndProfile = async (
  userId: string,
  payload: Record<string, unknown>
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await User.findById(userId).session(session);

    if (!user || user.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (payload.user) {
      if ((payload.user as { name: string }).name !== undefined) {
        user.name = (payload.user as { name: string }).name;
      }
      if ((payload.user as { phone: string }).phone !== undefined) {
        user.phone = (payload.user as { phone: string }).phone;
      }
      await user.save({ session });
    }

    if (payload.profile) {
      if (!UserProfileService.supportsRole(user.role as TRoles)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Profile update is not supported for this role"
        );
      }

      const updatedProfile = await userProfileService.updateRoleProfile(
        user.role as TRoles,
        { author: userId },
        payload.profile as Record<string, unknown>,
        session
      );

      if (!updatedProfile) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          "Profile could not be updated"
        );
      }
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const UserServices = {
  getUserWithProfile,
  getAllUsers,
  getSingleUser,
  updateUserImage,
  updateUserAndProfile,
};

export default UserServices;
