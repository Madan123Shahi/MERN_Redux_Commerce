// middleware/errorMiddleware.js
import AppError from "../utils/appError.js";

/* =========================
   Helper functions
========================= */

// MongoDB duplicate key
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: "${field}" (${value}). Please use another value.`;
  return new AppError(message, 409);
};

// Mongoose validation error
const handleValidationError = (err) => {
  const message = Object.values(err.errors)
    .map((el) => el.message)
    .join(". ");
  return new AppError(message, 400);
};

// Mongoose cast error (invalid ObjectId)
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// JWT errors
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired. Please log in again!", 401);

/* =========================
   Global Error Handler
========================= */
export const globalErrorHandler = (err, req, res, next) => {
  // Default values
  err.statusCode ||= 500;
  err.status ||= "error";
  err.isOperational ||= false;

  let error = { ...err, message: err.message }; // copy to avoid mutation

  // Handle specific error types
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.name === "CastError") error = handleCastError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  // Different response for dev vs prod
  if (process.env.NODE_ENV === "development") {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stack: error.stack,
      error,
    });
  }

  // Production: only send operational errors, hide internal programming errors
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  // Programming or unknown error
  console.error("ERROR 💥", err);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
};
