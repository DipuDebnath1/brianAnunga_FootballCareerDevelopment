import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { ProtectedRequest } from "../types/protected-request";
import { UserTokenPayload } from "../domains/Auth/auth.token.services";
import AppError from "../ErrorHandler/AppError";
import config from "../config/index";

export const authMiddleware = (
  req: ProtectedRequest,
  _res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access denied"));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as UserTokenPayload;

    req.user = {
      _id: decoded.userId,
      role: decoded.role,
      name: decoded.name,
      email: decoded.email,
      image: decoded.image,
    };

    next();
  } catch {
    next(new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token"));
  }
};
