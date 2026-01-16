import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import config from '../config/env';
import { Certificate } from '@prisma/client';

/**
 * PDF Service
 * Generates PDF certificates for download
 */

class PDFService {
  /**
   * Generate PDF certificate
   */
  async generateCertificatePDF(certificate: Certificate): Promise<string> {
    const outputPath = path.join(
      config.upload.certificatesDir,
      `cert-${certificate.certificateId}.pdf`
    );

    // Ensure directory exists
    await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });

    // Create PDF document
    const doc = new PDFDocument({
      size: 'LETTER',
      margin: 50,
    });

    // Pipe to file
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Certificate design
    const width = doc.page.width;
    const height = doc.page.height;

    // Background gradient effect (simple border)
    doc.rect(30, 30, width - 60, height - 60)
       .lineWidth(5)
       .stroke('#667eea');

    // Title
    doc.fontSize(32)
       .font('Helvetica-Bold')
       .fillColor('#1a1a1a')
       .text('CERTIFICATE OF COMPLETION', width / 2, 150, {
         align: 'center',
       });

    // Subtitle
    doc.fontSize(14)
       .font('Helvetica')
       .fillColor('#666666')
       .text('This is to certify that', width / 2, 220, {
         align: 'center',
       });

    // Recipient name
    doc.fontSize(36)
       .font('Helvetica-Bold')
       .fillColor('#1a1a1a')
       .text(certificate.recipientName, width / 2, 260, {
         align: 'center',
       });

    // Course title
    doc.fontSize(20)
       .font('Helvetica')
       .fillColor('#333333')
       .text('has successfully completed', width / 2, 340, {
         align: 'center',
       });

    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fillColor('#667eea')
       .text(certificate.courseTitle, width / 2, 380, {
         align: 'center',
       });

    // Issue date
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#666666')
       .text(
         `Issued on ${new Date(certificate.issueDate).toLocaleDateString('en-US', {
           year: 'numeric',
           month: 'long',
           day: 'numeric',
         })}`,
         width / 2,
         450,
         { align: 'center' }
       );

    // Certificate ID
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#999999')
       .text(`Certificate ID: ${certificate.certificateId}`, width / 2, 500, {
         align: 'center',
       });

    // Blockchain info
    doc.fontSize(8)
       .font('Helvetica')
       .fillColor('#cccccc')
       .text(
         `Blockchain Hash: ${certificate.blockchainHash.substring(0, 20)}...`,
         width / 2,
         530,
         { align: 'center' }
       );

    // Organization info (if available)
    if (certificate.organization) {
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor('#1a1a1a')
         .text(
           certificate.organization.name,
           width / 2,
           600,
           { align: 'center' }
         );
    }

    // Verification QR code note
    doc.fontSize(8)
       .font('Helvetica')
       .fillColor('#999999')
       .text(
         'Verify this certificate at: ' + certificate.verificationUrl,
         50,
         height - 80,
         { width: width - 100, align: 'center' }
       );

    // Finalize PDF
    doc.end();

    // Wait for stream to finish
    await new Promise<void>((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    // Return relative path
    return `/certificates/cert-${certificate.certificateId}.pdf`;
  }
}

export default new PDFService();

