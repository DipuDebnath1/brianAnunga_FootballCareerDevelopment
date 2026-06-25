import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError, ZodTypeAny } from "zod";
import { updateAgentProfileSchema } from "../domains/Agent/agent.validation";
import { updateClubProfileSchema } from "../domains/Club/club.validation";
import { updateCoachProfileSchema } from "../domains/Coach/coach.validation";
import { updatePlayerProfileSchema } from "../domains/Players/player.validation";
import UserValidation from "../domains/User/user.validation";
import AppError from "../ErrorHandler/AppError";
import { ProtectedRequest } from "../types/protected-request";
import { ROLE, TRoles } from "../utills/roles";
import { handleZodError } from "../utills/zodValidation";

const profileValidators: Partial<Record<TRoles, ZodTypeAny>> = {
  [ROLE.coach]: updateCoachProfileSchema,
  [ROLE.player]: updatePlayerProfileSchema,
  [ROLE.club]: updateClubProfileSchema,
  [ROLE.agents]: updateAgentProfileSchema,
};

export const validateUpdateProfile =
  () =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { user } = req as ProtectedRequest;

      if (!user) {
        return next(
          new AppError(httpStatus.UNAUTHORIZED, "User not authenticated")
        );
      }

      const parsed = UserValidation.updateProfileRequestSchema.parse(
        req.body ?? {}
      );

      if (!parsed.user && !parsed.profile) {
        return next(
          new AppError(
            httpStatus.BAD_REQUEST,
            "At least one of user or profile fields is required"
          )
        );
      }

      const profileSchema = profileValidators[user.role as TRoles];

      if (parsed.profile) {
        if (!profileSchema) {
          return next(
            new AppError(
              httpStatus.BAD_REQUEST,
              "Profile update is not supported for this role"
            )
          );
        }

        profileSchema.parse(parsed.profile);
      }

      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const simplified = handleZodError(error);
        return next(
          new AppError(simplified.statusCode, simplified.message)
        );
      }
      next(error);
    }
  };
