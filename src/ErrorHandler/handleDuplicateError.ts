import { ISimplifiedError } from "../types/errors.types";

interface DuplicateKeyError {
  code?: number;
  keyValue?: Record<string, unknown>;
}

const handleDuplicateError = (error: DuplicateKeyError): ISimplifiedError => {
  if (error.code !== 11000 || !error.keyValue) {
    return {
      statusCode: 500,
      message: "Unexpected duplicate error",
      errorMessages: [
        {
          path: "",
          message: "An unexpected error occurred while checking for duplicates",
        },
      ],
    };
  }

  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  const friendlyField = field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

  const message = `${friendlyField} '${value}' already exists`;

  return {
    statusCode: 409,
    message,
    errorMessages: [{ path: field, message }],
  };
};

export default handleDuplicateError;
