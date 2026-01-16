/**
 * Generate human-readable certificate IDs
 * Format: CRT-XXXX-XX (e.g., CRT-1234-AB)
 */
export const generateCertificateId = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 1000-9999
  const randomChars = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `CRT-${randomNum}-${randomChars}`;
};

/**
 * Generate unique transaction IDs
 */
export const generateTransactionId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TX-${timestamp}-${random}`;
};

