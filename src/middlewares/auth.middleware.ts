import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ProtectedRequest } from "../types/protected-request";
import { UserTokenPayload } from "../domains/Auth/auth.token.services";

export const authMiddleware = (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized Access Denied" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as UserTokenPayload;

    req.user = {
      _id: decoded.userId,
      role: decoded.role,
      name: decoded.name,
      email: decoded.email,
      image: decoded.image,
    };

    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
