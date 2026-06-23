import { NextFunction, Request, Response } from "express";
import catchAsync from "../utills/catchAsync";
import {
  applyParsedRequest,
  parseRequest,
  RequestValidationSchema,
} from "../utills/zodValidation";

const validationRequest = (schema: RequestValidationSchema) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const parsed = await parseRequest(req, schema);
    applyParsedRequest(req, parsed);
    next();
  });
};

export default validationRequest;
