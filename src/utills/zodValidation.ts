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

  // Express 5: req.query / req.params are read-only getters — merge in place
  if ("query" in parsed && parsed.query !== undefined) {
    Object.assign(
      req.query as Record<string, unknown>,
      parsed.query as Record<string, unknown>
    );
  }

  if ("params" in parsed && parsed.params !== undefined) {
    Object.assign(
      req.params as Record<string, unknown>,
      parsed.params as Record<string, unknown>
    );
  }
};

export const isZodError = (error: unknown): error is ZodError =>
  error instanceof ZodError;
