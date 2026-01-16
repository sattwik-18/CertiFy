import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  // Server
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),

  // Database
  DATABASE_URL: z.string().min(1),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // Email
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.string().optional(),
  EMAIL_SECURE: z.string().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // Blockchain
  BLOCKCHAIN_NETWORK: z.string().default('ethereum'),
  BLOCKCHAIN_RPC_URL: z.string().url().optional(),
  BLOCKCHAIN_EXPLORER_URL: z.string().url().optional(),
  BLOCKCHAIN_PRIVATE_KEY: z.string().optional(),
  USE_MOCK_BLOCKCHAIN: z.string().default('true'),

  // File Upload
  MAX_FILE_SIZE: z.string().default('20971520'), // 20MB
  UPLOAD_DIR: z.string().default('./uploads'),
  CERTIFICATES_DIR: z.string().default('./public/certificates'),

  // Security
  BCRYPT_ROUNDS: z.string().default('12'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),

  // URLs
  VERIFY_PAGE_URL: z.string().url(),
});

const env = envSchema.parse(process.env);

export default {
  server: {
    port: parseInt(env.PORT, 10),
    nodeEnv: env.NODE_ENV,
    apiUrl: env.API_URL,
    frontendUrl: env.FRONTEND_URL,
  },
  database: {
    url: env.DATABASE_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  email: {
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT ? parseInt(env.EMAIL_PORT, 10) : undefined,
    secure: env.EMAIL_SECURE === 'true',
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
    from: env.EMAIL_FROM || 'noreply@certify.app',
  },
  blockchain: {
    network: env.BLOCKCHAIN_NETWORK,
    rpcUrl: env.BLOCKCHAIN_RPC_URL,
    explorerUrl: env.BLOCKCHAIN_EXPLORER_URL,
    privateKey: env.BLOCKCHAIN_PRIVATE_KEY,
    useMock: env.USE_MOCK_BLOCKCHAIN === 'true',
  },
  upload: {
    maxFileSize: parseInt(env.MAX_FILE_SIZE, 10),
    uploadDir: env.UPLOAD_DIR,
    certificatesDir: env.CERTIFICATES_DIR,
  },
  security: {
    bcryptRounds: parseInt(env.BCRYPT_ROUNDS, 10),
    rateLimitWindowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    rateLimitMaxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),
  },
  urls: {
    verifyPage: env.VERIFY_PAGE_URL,
  },
};

