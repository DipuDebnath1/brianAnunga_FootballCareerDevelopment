import jwt from "jsonwebtoken";
import ms from "ms";
import config from "../../config/index";
import AppError from "../../ErrorHandler/AppError";
import httpStatus from "http-status";
import Token from "./token.model";
import { AccessTokenPayload } from "./token.interface";
import { tokenTypes } from "./token.type";

const generateToken = (
  userId: string,
  expiresIn: string | number,
  type: string,
  secret: string = config.jwt.secret
): string => {
  return jwt.sign({ sub: userId, type }, secret, {
    expiresIn: expiresIn as ms.StringValue,
  });
};

const saveToken = async (
  token: string,
  userId: string,
  expires: Date,
  type: string,
  blacklisted = false
) => {
  return Token.create({
    token,
    user: userId,
    expires,
    type,
    blacklisted,
  });
};

const verifyToken = async (token: string, type: string) => {
  const payload = jwt.verify(
    token,
    config.jwt.secret
  ) as AccessTokenPayload;

  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });

  if (!tokenDoc) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
  }

  return tokenDoc;
};

const generateAuthTokens = async (userId: string) => {
  const accessToken = generateToken(
    userId,
    config.jwt.expiresIn,
    tokenTypes.access
  );

  const refreshToken = generateToken(
    userId,
    config.jwt.refreshExpiresIn,
    tokenTypes.refresh,
    config.jwt.refreshSecret
  );

  const refreshMs = ms(config.jwt.refreshExpiresIn as ms.StringValue);
  const refreshExpires = new Date(Date.now() + refreshMs);

  await saveToken(
    refreshToken,
    userId,
    refreshExpires,
    tokenTypes.refresh
  );

  return { accessToken, refreshToken };
};

const invalidateUserAuthToken = async (token: string) => {
  await Token.updateMany({ token }, { blacklisted: true });
};

const refreshUserAuthToken = async (token: string) => {
  const payload = jwt.verify(
    token,
    config.jwt.refreshSecret
  ) as AccessTokenPayload;

  const tokenDoc = await Token.findOne({
    token,
    type: tokenTypes.refresh,
    user: payload.sub,
    blacklisted: false,
  });

  if (!tokenDoc) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired refresh token");
  }

  await invalidateUserAuthToken(token);

  return generateAuthTokens(payload.sub);
};

export {
  generateAuthTokens,
  invalidateUserAuthToken,
  refreshUserAuthToken,
  verifyToken,
};
