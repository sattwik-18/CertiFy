import QRCode from 'qrcode';
import config from '../config/env';
import path from 'path';
import fs from 'fs/promises';

/**
 * QR Code Service
 * Generates QR codes for certificate verification
 */

class QRCodeService {
  /**
   * Generate QR code image for certificate
   */
  async generateQRCode(verificationUrl: string, certificateId: string): Promise<string> {
    try {
      const outputPath = path.join(
        config.upload.certificatesDir,
        `qr-${certificateId}.png`
      );

      // Ensure directory exists
      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      // Generate QR code
      await QRCode.toFile(outputPath, verificationUrl, {
        errorCorrectionLevel: 'H',
        type: 'png',
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      // Return relative path for storage in database
      return `/certificates/qr-${certificateId}.png`;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code as data URL (for inline use)
   */
  async generateQRCodeDataURL(verificationUrl: string): Promise<string> {
    try {
      return await QRCode.toDataURL(verificationUrl, {
        errorCorrectionLevel: 'H',
        width: 512,
        margin: 2,
      });
    } catch (error) {
      console.error('Error generating QR code data URL:', error);
      throw new Error('Failed to generate QR code');
    }
  }
}

export default new QRCodeService();

