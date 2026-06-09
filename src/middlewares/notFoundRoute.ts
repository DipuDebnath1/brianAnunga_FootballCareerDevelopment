import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../ErrorHandler/AppError";

const notFoundRoute = (req: Request, _res: Response, next: NextFunction) => {
  next(
    new AppError(
      httpStatus.NOT_FOUND,
      `Route not found: ${req.method} ${req.originalUrl}`
    )
  );
};

export default notFoundRoute;
