import nodemailer from 'nodemailer';
import config from '../config/env';
import { Certificate } from '@prisma/client';

/**
 * Email Service
 * Handles sending emails for certificates and notifications
 */

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  /**
   * Initialize email transporter
   */
  private async getTransporter(): Promise<nodemailer.Transporter | null> {
    if (!config.email.host || !config.email.user || !config.email.pass) {
      console.warn('Email configuration missing. Email service disabled.');
      return null;
    }

    if (this.transporter) {
      return this.transporter;
    }

    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port || 587,
      secure: config.email.secure || false,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    return this.transporter;
  }

  /**
   * Send certificate email to recipient
   */
  async sendCertificateEmail(certificate: Certificate, verificationUrl: string) {
    const transporter = await this.getTransporter();
    if (!transporter) {
      console.log('Email service disabled. Certificate email not sent.');
      return;
    }

    const mailOptions = {
      from: config.email.from,
      to: certificate.recipientEmail,
      subject: `Your Certificate: ${certificate.courseTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Certificate Issued</h1>
            </div>
            <div class="content">
              <h2>Congratulations, ${certificate.recipientName}!</h2>
              <p>Your certificate for <strong>${certificate.courseTitle}</strong> has been issued.</p>
              <p><strong>Certificate ID:</strong> ${certificate.certificateId}</p>
              <p><strong>Issue Date:</strong> ${new Date(certificate.issueDate).toLocaleDateString()}</p>
              <p>You can view and verify your certificate using the link below:</p>
              <a href="${verificationUrl}" class="button">View Certificate</a>
              <p style="margin-top: 30px; font-size: 12px; color: #666;">
                This certificate is secured on the blockchain and can be verified by anyone.
              </p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Certificate email sent to ${certificate.recipientEmail}`);
    } catch (error) {
      console.error('Error sending certificate email:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, resetToken: string) {
    const transporter = await this.getTransporter();
    if (!transporter) {
      console.log('Email service disabled. Password reset email not sent.');
      return;
    }

    const resetUrl = `${config.urls.verifyPage}?token=${resetToken}&action=reset-password`;

    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  /**
   * Send organization notification
   */
  async sendOrganizationNotification(email: string, subject: string, message: string) {
    const transporter = await this.getTransporter();
    if (!transporter) {
      console.log('Email service disabled. Organization notification not sent.');
      return;
    }

    const mailOptions = {
      from: config.email.from,
      to: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            ${message}
          </div>
        </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending organization notification:', error);
      throw error;
    }
  }
}

export default new EmailService();

