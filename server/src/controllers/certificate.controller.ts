import { Request, Response, NextFunction } from 'express';
import certificateService from '../services/certificate.service';
import { sendSuccess } from '../utils/response';
import { PaginatedResponse } from '../types';

class CertificateController {
  /**
   * Issue a new certificate
   */
  issueCertificate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const certificate = await certificateService.issueCertificate(
        req.user.organizationId,
        req.user.userId,
        req.body
      );

      return sendSuccess(res, certificate, 'Certificate issued successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get certificate by ID
   */
  getCertificate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const certificate = await certificateService.getCertificateById(req.params.id);
      return sendSuccess(res, certificate);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Verify certificate (public endpoint)
   */
  verifyCertificate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.get('user-agent');
      
      const result = await certificateService.verifyCertificate(
        req.params.id,
        ipAddress,
        userAgent
      );

      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Revoke certificate
   */
  revokeCertificate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const certificate = await certificateService.revokeCertificate(
        req.params.id,
        req.user.userId,
        req.user.organizationId,
        req.body.reason
      );

      return sendSuccess(res, certificate, 'Certificate revoked successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get certificates for organization
   */
  getCertificates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const status = req.query.status as any;
      const recipientEmail = req.query.recipientEmail as string;

      const result = await certificateService.getCertificates(
        req.user.organizationId,
        {
          page,
          limit,
          search,
          status,
          recipientEmail,
        }
      );

      return sendSuccess<PaginatedResponse<any>>(res, result);
    } catch (error) {
      next(error);
    }
  };
}

export default new CertificateController();

