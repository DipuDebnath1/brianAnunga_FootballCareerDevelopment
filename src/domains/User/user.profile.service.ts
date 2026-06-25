import httpStatus from "http-status";
import mongoose, { FilterQuery, Model } from "mongoose";
import AppError from "../../ErrorHandler/AppError";

import { ROLE, TRoles } from "../../utills/roles";
import Agent from "../Agent/agent.model";
import Club from "../Club/club.model";
import Coach from "../Coach/coach.model";
import Player from "../Players/players.model";

const roleModels = {
  [ROLE.coach]: Coach.Coach,
  [ROLE.player]: Player,
  [ROLE.club]: Club,
  [ROLE.agents]: Agent,
} as const;


type ProfileRole = keyof typeof roleModels;

type RoleProfileFilter = FilterQuery<Record<string, unknown>>;

type ProfileUpdateOptions = {
  new: true;
  upsert: true;
  runValidators: true;
  session?: mongoose.ClientSession;
};

export class UserProfileService {
  static getRoleModel(role: TRoles): Model<mongoose.Document> | null {
    const model = roleModels[role as ProfileRole];
    return model ? (model as unknown as Model<mongoose.Document>) : null;
  }

  // check if role is supported
  static supportsRole(role: TRoles): boolean {
    return role in roleModels;
  }

  // find role profile by role and filter
  async findRoleProfile(
    role: TRoles,
    filter: RoleProfileFilter = {},
    profileSelect?: string
  ) {
    const Model = UserProfileService.getRoleModel(role);

    if (!Model) {
      return null;
    }

    const query = Model.findOne(filter);

    if (profileSelect?.trim()) {
      return query.select(profileSelect.replace(/,/g, " "));
    }

    return query;
  }

  // update role profile by role and filter
  async updateRoleProfile(
    role: TRoles,
    filter: RoleProfileFilter,
    profileData: Record<string, unknown>,
    session?: mongoose.ClientSession
  ) {
    const Model = UserProfileService.getRoleModel(role);

    if (!Model) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid role for profile");
    }

    const options: ProfileUpdateOptions = {
      new: true,
      upsert: true,
      runValidators: true,
      session,
    };

    return Model.findOneAndUpdate(
      filter,
      {
        $set: profileData,
        $setOnInsert: filter,
      },
      options
    );
  }
}

export const userProfileService = new UserProfileService();

export default userProfileService;

export { roleModels };
