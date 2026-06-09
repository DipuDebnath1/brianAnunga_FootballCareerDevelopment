import { ValidationError as JoiValidationError } from "joi";
import { ISimplifiedError } from "../types/errors.types";

const handleJoiError = (error: JoiValidationError): ISimplifiedError => {
  const errorMessages = error.details.map((detail) => ({
    path: detail.path.join(".") || "body",
    message: detail.message.replace(/"/g, ""),
  }));

  return {
    statusCode: 400,
    message: errorMessages.map((err) => err.message).join(", "),
    errorMessages,
  };
};

export default handleJoiError;
