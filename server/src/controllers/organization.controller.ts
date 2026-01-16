import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { sendSuccess } from '../utils/response';

class OrganizationController {
  /**
   * Get organization details
   */
  getOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const organization = await prisma.organization.findUnique({
        where: { id: req.user.organizationId },
        include: {
          _count: {
            select: {
              users: true,
              certificates: true,
            },
          },
        },
      });

      return sendSuccess(res, organization);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update organization details
   */
  updateOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const { name, domain, description, branding, settings } = req.body;

      const organization = await prisma.organization.update({
        where: { id: req.user.organizationId },
        data: {
          ...(name && { name }),
          ...(domain && { domain }),
          ...(description && { description }),
          ...(branding && { branding }),
          ...(settings && { settings }),
        },
      });

      return sendSuccess(res, organization, 'Organization updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get organization statistics
   */
  getStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const organizationId = req.user.organizationId;

      const [
        totalCertificates,
        validCertificates,
        revokedCertificates,
        expiredCertificates,
        totalVerifications,
        recentActivity,
      ] = await Promise.all([
        prisma.certificate.count({
          where: { organizationId },
        }),
        prisma.certificate.count({
          where: { organizationId, status: 'VALID' },
        }),
        prisma.certificate.count({
          where: { organizationId, status: 'REVOKED' },
        }),
        prisma.certificate.count({
          where: { organizationId, status: 'EXPIRED' },
        }),
        prisma.verificationLog.count({
          where: {
            certificate: {
              organizationId,
            },
          },
        }),
        prisma.activityLog.findMany({
          where: { organizationId },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
      ]);

      return sendSuccess(res, {
        certificates: {
          total: totalCertificates,
          valid: validCertificates,
          revoked: revokedCertificates,
          expired: expiredCertificates,
        },
        verifications: {
          total: totalVerifications,
        },
        recentActivity,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new OrganizationController();

