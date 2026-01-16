import { Router } from 'express';
import certificateController from '../controllers/certificate.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate, schemas } from '../middleware/validation.middleware';
type UserRole = 'ADMIN' | 'STAFF' | 'VIEWER';
import { verificationLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

/**
 * @route   POST /api/certificates
 * @desc    Issue new certificate
 * @access  Private (Admin, Staff)
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'STAFF'),
  validate(schemas.createCertificate),
  certificateController.issueCertificate
);

/**
 * @route   GET /api/certificates
 * @desc    Get certificates for organization
 * @access  Private
 */
router.get('/', authenticate, certificateController.getCertificates);

/**
 * @route   GET /api/certificates/:id
 * @desc    Get certificate by ID
 * @access  Private
 */
router.get('/:id', authenticate, certificateController.getCertificate);

/**
 * @route   POST /api/certificates/:id/revoke
 * @desc    Revoke certificate
 * @access  Private (Admin, Staff)
 */
router.post(
  '/:id/revoke',
  authenticate,
  authorize('ADMIN', 'STAFF'),
  validate(schemas.revokeCertificate),
  certificateController.revokeCertificate
);

export default router;

