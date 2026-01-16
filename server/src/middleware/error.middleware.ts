import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import { Prisma } from '@prisma/client';
import config from '../config/env';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  // Log error
  if (config.server.nodeEnv === 'development') {
    console.error('Error:', err);
  }

  // Handle known AppError
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return sendError(res, 'A record with this information already exists', 409);
    }
    if (err.code === 'P2025') {
      return sendError(res, 'Record not found', 404);
    }
    return sendError(res, 'Database error occurred', 500);
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return sendError(res, err.message, 400);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired', 401);
  }

  // Default error
  return sendError(
    res,
    config.server.nodeEnv === 'production' ? 'Internal server error' : err.message,
    500
  );
};

/**
 * Handle 404 errors
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
};

