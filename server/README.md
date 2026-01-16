# Certify Backend API

Production-ready backend API for the Certify platform - a blockchain-secured certificate issuing and verification system.

## 🏗️ Architecture

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt password hashing, helmet, CORS, rate limiting
- **Blockchain**: Ethereum-compatible (supports mock for development)

## 📁 Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── uploads/             # Uploaded files
└── public/
    └── certificates/    # Generated certificates and QR codes
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- (Optional) Email service credentials (Gmail, SendGrid, etc.)

### Installation

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database:**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run database migrations
   npm run prisma:migrate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 🔧 Environment Variables

See `.env.example` for all required environment variables. Key variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`: Email service credentials
- `USE_MOCK_BLOCKCHAIN`: Set to `true` for development (mock blockchain)

## 📡 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new organization
- `POST /api/auth/login` - Login user
- `POST /api/auth/password/reset-request` - Request password reset
- `POST /api/auth/password/reset` - Reset password
- `GET /api/auth/profile` - Get current user profile

### Certificates

- `POST /api/certificates` - Issue new certificate (Admin/Staff)
- `GET /api/certificates` - List certificates (with pagination, filtering)
- `GET /api/certificates/:id` - Get certificate details
- `POST /api/certificates/:id/revoke` - Revoke certificate (Admin/Staff)

### Verification (Public)

- `GET /api/verify/:id` - Verify certificate (no auth required)

### Organization

- `GET /api/organization` - Get organization details
- `PUT /api/organization` - Update organization
- `GET /api/organization/statistics` - Get organization statistics

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT-based authentication
- Rate limiting on all endpoints
- Input validation with Zod
- CORS protection
- Helmet.js security headers
- SQL injection protection (Prisma)
- Error handling without exposing internals

## 📊 Database Schema

The database includes the following main models:

- **User**: Users within organizations (Admin, Staff, Viewer roles)
- **Organization**: Institutions/companies issuing certificates
- **Certificate**: Issued certificates with blockchain hashes
- **Template**: Certificate templates
- **BlockchainRecord**: Blockchain transaction records
- **VerificationLog**: Public verification attempts
- **ActivityLog**: Organization activity tracking

## 🌐 Blockchain Integration

The platform supports two modes:

1. **Mock Blockchain** (Development): Simulates blockchain transactions
2. **Real Blockchain** (Production): Integrates with Ethereum-compatible networks

Each certificate is hashed and the hash is stored on the blockchain for verification.

## 📧 Email Service

The platform sends emails for:
- Certificate issuance notifications to recipients
- Password reset links
- Organization notifications

Configure email credentials in `.env` file.

## 📦 Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET` values
3. Configure real blockchain network
4. Set up proper email service
5. Configure database connection pooling
6. Set up reverse proxy (nginx)
7. Enable HTTPS
8. Set up monitoring and logging
9. Configure backups

### Build for Production

```bash
npm run build
npm start
```

## 🔍 Testing

Example API requests using curl:

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "organizationName": "Example University",
    "organizationEmail": "contact@example.edu"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Issue certificate (with token)
curl -X POST http://localhost:5000/api/certificates \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientName": "John Doe",
    "recipientEmail": "john@example.com",
    "courseTitle": "Advanced Web Development"
  }'
```

## 📝 License

MIT

