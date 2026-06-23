import { ZodError, ZodTypeAny } from "zod";
import { ISimplifiedError } from "../types/errors.types";

export const handleZodError = (error: ZodError): ISimplifiedError => {
  const errorMessages = error.issues.map((issue) => ({
    path: issue.path.join(".") || "body",
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: errorMessages.map((err) => err.message).join(", "),
    errorMessages,
  };
};

export type RequestValidationSchema = ZodTypeAny;

type ParsedRequest = {
  body?: unknown;
  query?: unknown;
  params?: unknown;
};

export const parseRequest = async (
  req: { body: unknown; query: unknown; params: unknown },
  schema: RequestValidationSchema
): Promise<ParsedRequest> => {
  return schema.parseAsync({
    body: req.body,
    query: req.query,
    params: req.params,
  }) as Promise<ParsedRequest>;
};

export const applyParsedRequest = (
  req: {
    body: unknown;
    query: unknown;
    params: unknown;
  },
  parsed: ParsedRequest
) => {
  if ("body" in parsed && parsed.body !== undefined) {
    req.body = parsed.body;
  }
  if ("query" in parsed && parsed.query !== undefined) {
    req.query = parsed.query as typeof req.query;
  }
  if ("params" in parsed && parsed.params !== undefined) {
    req.params = parsed.params as typeof req.params;
  }
};

export const isZodError = (error: unknown): error is ZodError =>
  error instanceof ZodError;
