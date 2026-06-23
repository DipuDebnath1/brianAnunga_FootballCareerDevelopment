import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/index";
import AppError from "../ErrorHandler/AppError";
import httpStatus from "http-status";
import { AccessTokenPayload } from "../domains/tokens/token.interface";

export const accessTokenDecoded = (token: string): AccessTokenPayload => {
  try {
    return jwt.verify(token, config.jwt.secret) as AccessTokenPayload;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token: " + message);
  }
};

export const refreshTokenDecoded = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token: " + message);
  }
};
