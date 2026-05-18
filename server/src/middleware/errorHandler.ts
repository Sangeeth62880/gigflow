import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '@/utils/ApiError';
import { env } from '@/config/env';

interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>[];
  stack?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Express requires 4 params for error middleware
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: Record<string, string>[] | undefined;

  // Custom ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  // Mongoose validation error
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose cast error (invalid ObjectId)
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // MongoDB duplicate key error
  else if (isDuplicateKeyError(err)) {
    statusCode = 409;
    const keyValue = (err as MongoServerError).keyValue;
    const field = keyValue ? Object.keys(keyValue)[0] : 'field';
    message = `Duplicate value for ${field}. This ${field} already exists.`;
  }

  // JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  if (env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  if (statusCode >= 500) {
    console.error('Server Error:', err);
  }

  res.status(statusCode).json(response);
}

// Type guard for MongoDB duplicate key error (code 11000)
interface MongoServerError extends Error {
  code: number;
  keyValue?: Record<string, unknown>;
}

function isDuplicateKeyError(err: Error): err is MongoServerError {
  return 'code' in err && (err as MongoServerError).code === 11000;
}
