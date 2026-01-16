// CertificateStatus and UserRole are now string types
export type CertificateStatus = 'VALID' | 'REVOKED' | 'EXPIRED' | 'PENDING';
export type UserRole = 'ADMIN' | 'STAFF' | 'VIEWER';

export interface JwtPayload {
  userId: string;
  email: string;
  organizationId: string;
  role: UserRole;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CertificateCreateInput {
  recipientName: string;
  recipientEmail: string;
  courseTitle: string;
  courseDescription?: string;
  issueDate?: string;
  expiryDate?: string;
  templateId?: string;
  metadata?: Record<string, any>;
}

export interface CertificateVerificationResult {
  isValid: boolean;
  certificate?: any;
  error?: string;
  tampered?: boolean;
}

