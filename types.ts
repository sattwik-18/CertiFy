
export enum CertificateStatus {
  VALID = 'VALID',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING'
}

export interface Certificate {
  id: string;
  recipientName: string;
  recipientEmail: string;
  courseTitle: string;
  issuingBody: string;
  issueDate: string;
  expiryDate?: string;
  blockchainHash: string;
  transactionId: string;
  status: CertificateStatus;
}

export interface OrgStats {
  totalIssued: number;
  activeCertificates: number;
  verificationRequests: number;
  securityScore: number;
}

export type AppView = 'LANDING' | 'AUTH' | 'DASHBOARD' | 'VERIFY' | 'PORTAL';
