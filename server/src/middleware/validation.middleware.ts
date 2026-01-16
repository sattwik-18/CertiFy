import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

/**
 * Validate request data against Zod schema
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        next(new ValidationError(message));
      } else {
        next(error);
      }
    }
  };
};

// Common validation schemas
export const schemas = {
  signup: z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      organizationName: z.string().min(1, 'Organization name is required'),
      organizationEmail: z.string().email('Invalid organization email'),
      organizationDomain: z.string().optional(),
    }),
  }),

  login: z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(1, 'Password is required'),
    }),
  }),

  createCertificate: z.object({
    body: z.object({
      recipientName: z.string().min(1, 'Recipient name is required'),
      recipientEmail: z.string().email('Invalid recipient email'),
      courseTitle: z.string().min(1, 'Course title is required'),
      courseDescription: z.string().optional(),
      issueDate: z.string().datetime().optional(),
      expiryDate: z.string().datetime().optional(),
      templateId: z.string().uuid().optional(),
      metadata: z.record(z.any()).optional(),
    }),
  }),

  verifyCertificate: z.object({
    params: z.object({
      id: z.string().min(1, 'Certificate ID is required'),
    }),
  }),

  revokeCertificate: z.object({
    params: z.object({
      id: z.string().min(1, 'Certificate ID is required'),
    }),
    body: z.object({
      reason: z.string().optional(),
    }),
  }),
};

