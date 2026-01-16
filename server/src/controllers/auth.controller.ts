import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { AppError } from '../utils/errors';

class AuthController {
  /**
   * Sign up new organization and admin user
   */
  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.signup(req.body);
      return sendSuccess(res, result, 'Organization and user created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Request password reset
   */
  requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await authService.requestPasswordReset(email);
      return sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Reset password with token
   */
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword(token, newPassword);
      return sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get current user profile
   */
  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const prisma = (await import('../config/database')).default;
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: {
          organization: true,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          organization: true,
        },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();

