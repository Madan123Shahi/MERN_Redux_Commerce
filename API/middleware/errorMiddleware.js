// middleware/errorMiddleware.js
import AppError from "../utils/appError.js";

const handleDuplicateKeyError = (err) => {
  const message = `Duplicate field value: ${Object.keys(
    err.keyValue
  )}. Please use another value.`;
  return new AppError(message, 409);
};

const handleValidationError = (err) => {
  const message = Object.values(err.errors)
    .map((el) => el.message)
    .join(". ");
  return new AppError(message, 400);
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode ||= 500;
  err.status ||= "error";

  // Mongo duplicate key
  if (err.code === 11000) err = handleDuplicateKeyError(err);

  // Mongo validation
  if (err.name === "ValidationError") err = handleValidationError(err);

  // Production response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
