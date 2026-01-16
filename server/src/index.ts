import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimit.middleware';
import authRoutes from './routes/auth.routes';
import certificateRoutes from './routes/certificate.routes';
import verifyRoutes from './routes/verify.routes';
import organizationRoutes from './routes/organization.routes';
import path from 'path';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.server.frontendUrl,
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api', apiLimiter);

// Serve static files (certificates, QR codes)
app.use('/certificates', express.static(path.join(__dirname, '../public/certificates')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/organization', organizationRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.server.port;

app.listen(PORT, () => {
  console.log(`
  🚀 Certify Backend Server Running
  ═════════════════════════════════
  Environment: ${config.server.nodeEnv}
  Port: ${PORT}
  API URL: ${config.server.apiUrl}
  Frontend URL: ${config.server.frontendUrl}
  ═════════════════════════════════
  `);
});

export default app;

