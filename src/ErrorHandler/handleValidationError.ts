import { Error as MongooseError } from "mongoose";
import { ISimplifiedError } from "../types/errors.types";

const handleValidationError = (
  error: MongooseError.ValidationError
): ISimplifiedError => {
  const errorMessages = Object.values(error.errors).map(
    (el: MongooseError.ValidatorError | MongooseError.CastError) => ({
      path: el.path,
      message: el.message,
    })
  );

  return {
    statusCode: 400,
    message: errorMessages.map((err) => err.message).join(", "),
    errorMessages,
  };
};

export default handleValidationError;
