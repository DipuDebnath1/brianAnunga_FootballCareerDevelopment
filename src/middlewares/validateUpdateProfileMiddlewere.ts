import { NextFunction, Request, Response } from "express";
import { updateAgentProfileSchema } from "../domains/Agent/agent.validation";
import { updateClubProfileSchema } from "../domains/Club/club.validation";
import { updateCoachProfileSchema } from "../domains/Coach/coach.validation";
import { updatePlayerProfileSchema } from "../domains/Players/player.validation";
import UserValidation from "../domains/User/user.validation";
import { ProtectedRequest } from "../types/protected-request";
    
const profileValidators = {
  coach: updateCoachProfileSchema,
  player: updatePlayerProfileSchema,
  club: updateClubProfileSchema,
  agent: updateAgentProfileSchema,
};


export const validateUpdateProfile =
  () => async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { user } = req as ProtectedRequest;
      console.log(user);


      UserValidation.updateUserSchema.parse(req.body);

      const profileSchema =
        profileValidators[
          user?.role as keyof typeof profileValidators
        ];

      console.log(profileSchema);

      if (profileSchema && req.body?.profile) {
        console.log(req.body.profile);
        profileSchema.parse(req.body.profile);
      }

      next();
    } catch (error) {
      next(error);
    }
  };