import httpStatus from "http-status";
import mongoose, { FilterQuery, PipelineStage, Types } from "mongoose";
import AppError from "../../ErrorHandler/AppError";
import { UserBaseService } from "../../service";
import { ROLE, TRoles } from "../../utills/roles";
import { IUser } from "./user.interface";
import User from "./user.model";
import userProfileService, { UserProfileService } from "./user.profile.service";
import {
  USER_IMAGE_UPDATE_SELECT
} from "./user.utils";
const ObjectId = Types.ObjectId;


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


// get all users with pagination
const AllUsers = async (query: FilterQuery<IUser>) => {
  return UserBaseService.findWithPagination({ filters: query, select: "name email image role",
  ...query    
  }, 
  );
}

// all coaches for players
const AllCoachesForPlayers = async (query: FilterQuery<IUser>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const search = query.search || "";

  const filters = {
    isDeleted: false,
    role: ROLE.coach,
    ...(search ? { name: { $regex: search, $options: "i" },email: { $regex: search, $options: "i" } } : {}),
  };

  const pipeplibe : PipelineStage[] = [
    {
      $match: filters
      
    },
    {
      $lookup: {
        from: "coaches",
        localField: "_id",
        foreignField: "user_id",
        as: "coach",
      },
    },
    {
      $unwind: "$coach",
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        image: 1,
        profile : {
          experiences: "$coach.experiences",
          areaOfExpertise: "$coach.areaOfExpertise",
        }
      },
    },
    {
      $match: {
        "coach.isAvailable": true,
      },
    },
  ];

  return UserBaseService.aggregateWithPagination(pipeplibe, { page, limit });

}

// coach profile 
const CoachProfile = async (coachId: string) => {
  const pipeplibe : PipelineStage[] = [
    {
      $match: {
        _id: new ObjectId(coachId),
        isDeleted: false,
        role: ROLE.coach,
      },
    },
    {
      $lookup: {
        from: "coaches",
        localField: "_id",
        foreignField: "author",
        as: "coach",
      },
    },
    {
      $unwind: "$coach",
    },
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "author",
        as: "ratings",
      },
    },
    {
      $unwind: "$ratings",
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        image: 1,
        profile : {
          experiences: "$coach.experiences",
          areaOfExpertise: "$coach.areaOfExpertise",
        },
        totalRating: { $sum: "$ratings.rating.value" },
        avgRating: { $avg: "$ratings.rating.value" },
      },
    },
  ];
  return UserBaseService.aggregateWithPagination(pipeplibe, { page: 1, limit: 1 });
}
// all agents for players
const AllAgentsForPlayers = async (query: FilterQuery<IUser>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = query.search || "";

  const filters = {
    isDeleted: false,
    role: ROLE.coach,
    ...(search ? { name: { $regex: search, $options: "i" },email: { $regex: search, $options: "i" } } : {}),
  };

  const pipeplibe : PipelineStage[] = [
    {
      $match: filters
    },
    {
      $lookup: {
        from: "agents",
        localField: "_id",
        foreignField: "author",
        as: "agent",
      },
    },
    {
      $unwind: "$agent",
    },
        {
      $lookup: {
        from: "agents",
        localField: "_id",
        foreignField: "author",
        as: "agent",
      },
    },
    {
      $unwind: "$agent",
    },
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "author",
        as: "ratings",
      },
    },
    {
      $unwind: "$ratings",
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        image: 1,
        profile : {
          experiences: "$agent.experiences",
          areaOfExpertise: "$agent.areaOfExpertise",
        },
        totalRating: { $sum: "$ratings.rating.value" },
        avgRating: { $avg: "$ratings.rating.value" },
      },
    },
    ];
    return UserBaseService.aggregateWithPagination(pipeplibe, { page, limit });
}

// agent profile 
const AgentProfile = async (agentId: string) => {
  const pipeplibe : PipelineStage[] = [
    {
      $match: {
        _id: new ObjectId(agentId),
        isDeleted: false,
        role: ROLE.agents,
      },
    },
    {
      $lookup: {
        from: "agents",
        localField: "_id",
        foreignField: "author",
        as: "agent",
      },
    },
    {
      $unwind: "$agent",
    },
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "author",
        as: "ratings",
      },
    },
    {
      $unwind: "$ratings",
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        image: 1,
        profile : {
          experiences: "$agent.experiences",
          areaOfExpertise: "$agent.areaOfExpertise",
        },
        totalRating: { $sum: "$ratings.rating.value" },
        avgRating: { $avg: "$ratings.rating.value" },
      },
    },
    ];
return UserBaseService.aggregateWithPagination(pipeplibe, { page: 1, limit: 1 });
}


// update user image
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

// update user and profile
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
  updateUserImage,
  updateUserAndProfile,
  AllCoachesForPlayers,
  AllAgentsForPlayers,
  AllUsers,
  CoachProfile,
  AgentProfile,
};

export default UserServices;
