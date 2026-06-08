import jwt, { SignOptions } from "jsonwebtoken";
import ms from "ms";

export interface UserTokenPayload {
  userId: string;
  role: string;
  name: string;
  email: string;
  image: string;
}

export const createToken = (
  userDetails: UserTokenPayload,
  secret: string,
  expiresIn: string | number
): string => {
  const options: SignOptions = { expiresIn: expiresIn as ms.StringValue };
  return jwt.sign(userDetails, secret, options);
};

export const createRefreshToken = (userDetails: UserTokenPayload): string => {
  return createToken(userDetails, process.env.JWT_REFRESH_SECRET!, "30d");
};

export const verifyRefreshToken = (token: string): UserTokenPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as UserTokenPayload;
};
