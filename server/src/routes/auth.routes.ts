import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validate, schemas } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register new organization and admin user
 * @access  Public
 */
router.post('/signup', authLimiter, validate(schemas.signup), authController.signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authLimiter, validate(schemas.login), authController.login);

/**
 * @route   POST /api/auth/password/reset-request
 * @desc    Request password reset
 * @access  Public
 */
router.post('/password/reset-request', authLimiter, authController.requestPasswordReset);

/**
 * @route   POST /api/auth/password/reset
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/password/reset', authLimiter, authController.resetPassword);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, authController.getProfile);

export default router;

