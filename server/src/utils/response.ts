import { Response } from 'express';
import { ApiResponse } from '../types';

/**
 * Send standardized API responses
 */
export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data?: T,
  message?: string,
  error?: string
): Response => {
  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
  };

  if (data) response.data = data;
  if (message) response.message = message;
  if (error) response.error = error;

  return res.status(statusCode).json(response);
};

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
): Response => {
  return sendResponse(res, statusCode, data, message);
};

export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 500
): Response => {
  return sendResponse(res, statusCode, undefined, undefined, error);
};

