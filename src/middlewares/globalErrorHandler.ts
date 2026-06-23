import { ErrorRequestHandler } from "express";
import { Error as MongooseError } from "mongoose";
import httpStatus from "http-status";
import AppError from "../ErrorHandler/AppError";
import handleValidationError from "../ErrorHandler/handleValidationError";
import handleDuplicateError from "../ErrorHandler/handleDuplicateError";
import { IErrorMessage } from "../types/errors.types";
import logger from "../lib/logger";
import config from "../config/index";
import { handleZodError, isZodError } from "../utills/zodValidation";

const isDevelopment = !config.isProduction;

const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  logger.error(`globalErrorHandler: ${error instanceof Error ? error.message : String(error)}`);

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorMessages: IErrorMessage[] = [];

  if (isZodError(error)) {
    const simplified = handleZodError(error);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorMessages = simplified.errorMessages;
  } else if (error instanceof MongooseError.ValidationError) {
    const simplified = handleValidationError(error);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorMessages = simplified.errorMessages;
  } else if (error.name === "MongoServerError" && (error as { code?: number }).code === 11000) {
    const simplified = handleDuplicateError(error as { code?: number; keyValue?: Record<string, unknown> });
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorMessages = simplified.errorMessages;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = [{ path: "", message: error.message }];
  } else if (error instanceof Error) {
    message = error.message || "Internal Server Error";
    errorMessages = [{ path: "", message }];
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    error: errorMessages,
    ...(isDevelopment && error instanceof Error ? { stack: error.stack } : {}),
  });
};

export default globalErrorHandler;
