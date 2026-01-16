import bcrypt from 'bcrypt';
import prisma from '../config/database';
import config from '../config/env';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
// UserRole: "ADMIN" | "STAFF" | "VIEWER"
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';
import crypto from 'crypto';

class AuthService {
  /**
   * Hash password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.security.bcryptRounds);
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Register a new organization and admin user
   */
  async signup(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    organizationName: string;
    organizationEmail: string;
    organizationDomain?: string;
  }) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Check if organization email already exists
    const existingOrg = await prisma.organization.findUnique({
      where: { email: data.organizationEmail },
    });

    if (existingOrg) {
      throw new ConflictError('Organization with this email already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(data.password);

    // Create organization and user in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: data.organizationName,
          email: data.organizationEmail,
          domain: data.organizationDomain,
        },
      });

      // Create admin user
      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'ADMIN',
          organizationId: organization.id,
        },
      });

      return { user, organization };
    });

    // Generate tokens
    const payload = {
      userId: result.user.id,
      email: result.user.email,
      organizationId: result.organization.id,
      role: result.user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        organizationId: result.organization.id,
      },
      organization: {
        id: result.organization.id,
        name: result.organization.name,
        email: result.organization.email,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user
   */
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    const passwordValid = await this.comparePassword(password, user.passwordHash);

    if (!passwordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const payload = {
      userId: user.id,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
      },
      organization: user.organization,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Generate password reset token
   */
  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return { message: 'If the email exists, a password reset link has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    // TODO: Send email with reset link
    // await emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If the email exists, a password reset link has been sent' };
  }

  /**
   * Reset password using token
   */
  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid or expired reset token');
    }

    const passwordHash = await this.hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return { message: 'Password reset successfully' };
  }
}

export default new AuthService();

