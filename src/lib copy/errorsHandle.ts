// src/utils/errorHandler.ts
export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack }; // Return the error message and stack trace for debugging
  } else {
    return { message: "An unknown error occurred" }; // Fallback for unknown errors
  }
};
