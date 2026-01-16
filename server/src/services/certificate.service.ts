import prisma from '../config/database';
import blockchainService from './blockchain.service';
import emailService from './email.service';
import qrService from './qr.service';
import pdfService from './pdf.service';
import { generateCertificateId, generateTransactionId } from '../utils/generateId';
import config from '../config/env';
import { CertificateCreateInput } from '../types';
// CertificateStatus: "VALID" | "REVOKED" | "EXPIRED" | "PENDING"
import { NotFoundError, ValidationError } from '../utils/errors';

class CertificateService {
  /**
   * Issue a new certificate
   */
  async issueCertificate(
    organizationId: string,
    issuerId: string,
    data: CertificateCreateInput
  ) {
    // Generate unique certificate ID
    let certificateId = generateCertificateId();
    
    // Ensure uniqueness
    let exists = await prisma.certificate.findUnique({
      where: { certificateId },
    });
    
    while (exists) {
      certificateId = generateCertificateId();
      exists = await prisma.certificate.findUnique({
        where: { certificateId },
      });
    }

    // Prepare certificate data for blockchain hashing
    const certificateData = {
      certificateId,
      recipientName: data.recipientName,
      recipientEmail: data.recipientEmail,
      courseTitle: data.courseTitle,
      issueDate: data.issueDate || new Date().toISOString(),
      organizationId,
      issuerId,
    };

    // Store hash on blockchain
    const blockchainTx = await blockchainService.storeCertificateHash(
      certificateData,
      certificateId
    );

    // Generate verification URL
    const verificationUrl = `${config.urls.verifyPage}/${certificateId}`;

    // Generate QR code
    const qrCodeUrl = await qrService.generateQRCode(verificationUrl, certificateId);

    // Create certificate record first (for PDF generation)
    const certificate = await prisma.certificate.create({
      data: {
        certificateId,
        recipientName: data.recipientName,
        recipientEmail: data.recipientEmail,
        courseTitle: data.courseTitle,
        courseDescription: data.courseDescription,
        issueDate: new Date(data.issueDate || Date.now()),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        organizationId,
        issuerId,
        templateId: data.templateId || null,
        blockchainHash: blockchainTx.transactionHash,
        transactionId: generateTransactionId(),
        blockchainNetwork: config.blockchain.network,
        blockchainExplorerUrl: blockchainService.getExplorerUrl(blockchainTx.transactionHash),
        qrCodeUrl,
        verificationUrl,
        metadata: data.metadata || {},
        status: 'VALID',
      },
      include: {
        organization: true,
        issuer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Generate PDF certificate (async, don't block response)
    pdfService.generateCertificatePDF(certificate).then(async (pdfUrl) => {
      await prisma.certificate.update({
        where: { id: certificate.id },
        data: { certificatePdfUrl: pdfUrl },
      });
    }).catch((error) => {
      console.error('Failed to generate PDF:', error);
      // Don't fail the request if PDF generation fails
    });

    // Create blockchain record
    await prisma.blockchainRecord.create({
      data: {
        certificateId: certificate.id,
        transactionHash: blockchainTx.transactionHash,
        blockNumber: blockchainTx.blockNumber,
        blockHash: blockchainTx.blockHash,
        gasUsed: blockchainTx.gasUsed,
        gasPrice: blockchainTx.gasPrice,
        network: config.blockchain.network,
        status: blockchainTx.status,
        confirmationCount: blockchainTx.confirmationCount,
        confirmedAt: blockchainTx.status === 'confirmed' ? new Date() : null,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        organizationId,
        userId: issuerId,
        action: 'CERTIFICATE_ISSUED',
        entityType: 'certificate',
        entityId: certificate.id,
        description: `Certificate ${certificateId} issued to ${data.recipientName}`,
      },
    });

    // Send email to recipient
    try {
      await emailService.sendCertificateEmail(certificate, verificationUrl);
    } catch (error) {
      console.error('Failed to send certificate email:', error);
      // Don't fail the request if email fails
    }

    return certificate;
  }

  /**
   * Get certificate by ID
   */
  async getCertificateById(id: string) {
    const certificate = await prisma.certificate.findUnique({
      where: { certificateId: id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            email: true,
            logoUrl: true,
            domain: true,
          },
        },
        issuer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        blockchainRecords: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!certificate) {
      throw new NotFoundError('Certificate');
    }

    return certificate;
  }

  /**
   * Verify certificate
   */
  async verifyCertificate(certificateId: string, ipAddress?: string, userAgent?: string) {
    const certificate = await this.getCertificateById(certificateId);

    // Check if expired
    if (certificate.expiryDate && new Date(certificate.expiryDate) < new Date()) {
      await prisma.certificate.update({
        where: { id: certificate.id },
        data: { status: 'EXPIRED' },
      });
      certificate.status = 'EXPIRED';
    }

    // Log verification attempt
    await prisma.verificationLog.create({
      data: {
        certificateId: certificate.id,
        ipAddress,
        userAgent,
        verified: certificate.status === 'VALID',
        verificationMethod: 'web',
      },
    });

    return {
      isValid: certificate.status === 'VALID',
      certificate,
      tampered: false, // In a real implementation, verify hash integrity
    };
  }

  /**
   * Revoke certificate
   */
  async revokeCertificate(
    certificateId: string,
    userId: string,
    organizationId: string,
    reason?: string
  ) {
    const certificate = await this.getCertificateById(certificateId);

    // Verify ownership
    if (certificate.organizationId !== organizationId) {
      throw new ValidationError('Certificate does not belong to your organization');
    }

    // Update certificate status
    const updated = await prisma.certificate.update({
      where: { id: certificate.id },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
        revokedBy: userId,
        revocationReason: reason,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        organizationId,
        userId,
        action: 'CERTIFICATE_REVOKED',
        entityType: 'certificate',
        entityId: certificate.id,
        description: `Certificate ${certificateId} revoked`,
        metadata: { reason },
      },
    });

    return updated;
  }

  /**
   * Get certificates for organization with filtering and pagination
   */
  async getCertificates(
    organizationId: string,
    options: {
      page?: number;
      limit?: number;
      search?: string;
      status?: CertificateStatus;
      recipientEmail?: string;
    } = {}
  ) {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {
      organizationId,
    };

    if (options.status) {
      where.status = options.status;
    }

    if (options.recipientEmail) {
      where.recipientEmail = options.recipientEmail;
    }

    if (options.search) {
      where.OR = [
        { recipientName: { contains: options.search, mode: 'insensitive' } },
        { recipientEmail: { contains: options.search, mode: 'insensitive' } },
        { courseTitle: { contains: options.search, mode: 'insensitive' } },
        { certificateId: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          issuer: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.certificate.count({ where }),
    ]);

    return {
      data: certificates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default new CertificateService();

