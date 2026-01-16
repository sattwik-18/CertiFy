import { Router } from 'express';
import certificateController from '../controllers/certificate.controller';
import { validate, schemas } from '../middleware/validation.middleware';
import { verificationLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

/**
 * @route   GET /api/verify/:id
 * @desc    Verify certificate (public)
 * @access  Public
 */
router.get(
  '/:id',
  verificationLimiter,
  validate(schemas.verifyCertificate),
  certificateController.verifyCertificate
);

export default router;

