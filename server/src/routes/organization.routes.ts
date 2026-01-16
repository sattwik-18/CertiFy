import { Router } from 'express';
import organizationController from '../controllers/organization.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/organization
 * @desc    Get organization details
 * @access  Private
 */
router.get('/', organizationController.getOrganization);

/**
 * @route   PUT /api/organization
 * @desc    Update organization details
 * @access  Private (Admin)
 */
router.put('/', organizationController.updateOrganization);

/**
 * @route   GET /api/organization/statistics
 * @desc    Get organization statistics
 * @access  Private
 */
router.get('/statistics', organizationController.getStatistics);

export default router;

