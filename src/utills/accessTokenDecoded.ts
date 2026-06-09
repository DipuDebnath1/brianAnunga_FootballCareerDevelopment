import jwt from "jsonwebtoken";
import config from "../config";
import AppError from "../ErrorHandler/AppError";
import httpStatus from "http-status";
import { UserTokenPayload } from "../domains/Auth/auth.token.services";

export const accessTokenDecoded = (token: string): UserTokenPayload => {
  try {
    return jwt.verify(token, config.jwt.secret) as UserTokenPayload;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token: " + message);
  }
};  