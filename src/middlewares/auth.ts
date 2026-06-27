import { NextFunction, Response } from "express";
import httpStatus from "http-status";
import AppError from "../ErrorHandler/AppError";
import User from "../domains/User/user.model";
import { AccessTokenPayload } from "../domains/tokens/token.interface";
import { ProtectedRequest } from "../types/protected-request";
import { accessTokenDecoded } from "../utills/accessTokenDecoded";
import roles, { Permission, TRoles } from "../utills/roles";

const auth =
  (...requiredRights: Permission[]) =>
  async (req: ProtectedRequest, _res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      const authorization = req.headers.authorization;
      if (authorization?.startsWith("Bearer ")) {
        token = authorization.split(" ")[1];
      }

      if (!token) {
        token = req.cookies?.access_token;
      }

      if (!token) {
        return next(
          new AppError(httpStatus.UNAUTHORIZED, "Authorization token missing!")
        );
      }

      const decodedData = accessTokenDecoded(token) as AccessTokenPayload;
      const userId = decodedData.sub;

      const user = await User.findById(userId).select("name email image role isDeleted");
      if (!user) {
        return next(new AppError(httpStatus.UNAUTHORIZED, "User not found"));
      }

      if (user.isDeleted) {
        return next(
          new AppError(httpStatus.UNAUTHORIZED, "User account is deleted")
        );
      }

      if (!user.role) {
        return next(
          new AppError(httpStatus.FORBIDDEN, "User role does not exist")
        );
      }

      const userRoles = roles.roleRights.get(user.role as TRoles);
      if (!userRoles) {
        return next(
          new AppError(httpStatus.FORBIDDEN, "User role does not exist")
        );
      }

      if (requiredRights.length) {
        const hasRequiredRights = requiredRights.every((requiredRight) =>
          userRoles.includes(requiredRight)
        );
        if (
          !hasRequiredRights &&
          req.params.userId !== user._id.toString()
        ) {
          return next(new AppError(httpStatus.FORBIDDEN, "Forbidden"));
        }
      }

      req.user = {
        _id: user._id.toString(),
        role: user.role,
        name: user.name,
        email: user.email,
        image: user.image,
      };

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
