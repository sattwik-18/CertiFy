# Certify - Blockchain-Secured Certificate Platform

A production-ready platform for institutions, governments, and organizations to issue secure blockchain-verified certificates and allow the public to verify them later.

## 🏗️ Architecture

This is a full-stack application with:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT-based
- **Blockchain**: Ethereum-compatible (supports mock for development)

## 📁 Project Structure

```
CertiFy/
├── server/                 # Backend API
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utilities
│   ├── prisma/            # Database schema
│   └── package.json
├── src/                   # Frontend
│   ├── lib/               # API client
│   └── components/        # React components
├── App.tsx               # Main React component
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- (Optional) Email service credentials

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb certify_db

# Or use your preferred method to create a database
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your configuration (especially DATABASE_URL)

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# From project root
npm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔧 Configuration

### Backend Environment Variables (.env)

Key variables in `server/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/certify_db"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-min-32-chars"
USE_MOCK_BLOCKCHAIN=true  # Set to false for real blockchain
FRONTEND_URL="http://localhost:3000"

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@certify.app
```

### Frontend Environment Variables (.env.local)

```env
VITE_API_URL=http://localhost:5000/api
VITE_FRONTEND_URL=http://localhost:3000
```

## 📡 API Documentation

### Authentication

#### Sign Up
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123",
  "organizationName": "Example University",
  "organizationEmail": "contact@example.edu"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

# Response includes accessToken
```

#### Get Profile
```bash
GET /api/auth/profile
Authorization: Bearer <token>
```

### Certificates

#### Issue Certificate
```bash
POST /api/certificates
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientName": "John Doe",
  "recipientEmail": "john@example.com",
  "courseTitle": "Advanced Web Development",
  "courseDescription": "Completed with excellence",
  "expiryDate": "2026-12-31T00:00:00Z"  // optional
}
```

#### List Certificates
```bash
GET /api/certificates?page=1&limit=20&search=john&status=VALID
Authorization: Bearer <token>
```

#### Get Certificate
```bash
GET /api/certificates/CRT-1234-AB
Authorization: Bearer <token>
```

#### Revoke Certificate
```bash
POST /api/certificates/CRT-1234-AB/revoke
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Duplicate certificate"
}
```

### Public Verification

```bash
GET /api/verify/CRT-1234-AB
# No authentication required
```

### Organization

```bash
GET /api/organization
Authorization: Bearer <token>

GET /api/organization/statistics
Authorization: Bearer <token>

PUT /api/organization
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "domain": "example.edu"
}
```

## 🔐 Frontend Integration

The frontend includes an API client in `src/lib/api.ts`. Here's how to use it:

```typescript
import { api } from './lib/api';

// Login
const response = await api.login('admin@example.com', 'password123');
// Token is automatically stored

// Issue certificate
const cert = await api.issueCertificate({
  recipientName: 'John Doe',
  recipientEmail: 'john@example.com',
  courseTitle: 'Web Development'
});

// Verify certificate (public)
const verification = await api.verifyCertificate('CRT-1234-AB');

// Get certificates
const certificates = await api.getCertificates({ page: 1, limit: 20 });
```

### Updating Frontend Components

To connect the frontend to the backend, update components to use the API client:

1. **AuthView**: Replace mock login with `api.login()`
2. **IssueNewTab**: Replace mock issuance with `api.issueCertificate()`
3. **RegistryTab**: Fetch certificates with `api.getCertificates()`
4. **VerifyView**: Use `api.verifyCertificate()` for public verification

Example update for AuthView:

```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');

const handleLogin = async () => {
  try {
    const response = await api.login(email, password);
    if (response.success) {
      onLogin(); // Navigate to dashboard
    }
  } catch (err) {
    setError(err.message);
  }
};
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT-based authentication
- ✅ Rate limiting on all endpoints
- ✅ Input validation with Zod
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ SQL injection protection (Prisma)
- ✅ Error handling without exposing internals

## 🌐 Blockchain Integration

### Development (Mock Blockchain)

Set `USE_MOCK_BLOCKCHAIN=true` in `.env`. The system will simulate blockchain transactions without actual network calls.

### Production (Real Blockchain)

Set `USE_MOCK_BLOCKCHAIN=false` and configure:

```env
BLOCKCHAIN_NETWORK=ethereum
BLOCKCHAIN_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
BLOCKCHAIN_EXPLORER_URL=https://etherscan.io/tx
BLOCKCHAIN_PRIVATE_KEY=your-private-key
```

**Note**: Real blockchain integration requires additional implementation in `server/src/services/blockchain.service.ts`.

## 📊 Database Schema

The platform uses the following main models:

- **User**: Users within organizations (Admin, Staff, Viewer roles)
- **Organization**: Institutions/companies issuing certificates
- **Certificate**: Issued certificates with blockchain hashes
- **Template**: Certificate templates
- **BlockchainRecord**: Blockchain transaction records
- **VerificationLog**: Public verification attempts
- **ActivityLog**: Organization activity tracking

View the full schema in `server/prisma/schema.prisma`.

## 📧 Email Service

The platform sends emails for:
- Certificate issuance notifications to recipients
- Password reset links
- Organization notifications

Configure email credentials in `server/.env`. If not configured, emails will be logged to console.

## 🧪 Testing

### Test API with curl

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "organizationName": "Test University",
    "organizationEmail": "contact@test.edu"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Save the token and use it:
TOKEN="your-token-here"

# Issue certificate
curl -X POST http://localhost:5000/api/certificates \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientName": "John Doe",
    "recipientEmail": "john@example.com",
    "courseTitle": "Test Course"
  }'

# Verify (public)
curl http://localhost:5000/api/verify/CRT-1234-AB
```

## 📦 Deployment

### Production Checklist

1. Set `NODE_ENV=production` in both frontend and backend
2. Use strong `JWT_SECRET` values (32+ characters)
3. Configure real blockchain network or keep mock for testing
4. Set up proper email service
5. Configure database connection pooling
6. Set up reverse proxy (nginx)
7. Enable HTTPS
8. Set up monitoring and logging
9. Configure backups

### Build for Production

**Backend:**
```bash
cd server
npm run build
npm start
```

**Frontend:**
```bash
npm run build
# Serve the dist/ directory
```

## 🔍 Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` in `server/.env`
- Ensure PostgreSQL is running
- Check database permissions

### JWT Token Errors

- Verify `JWT_SECRET` is set (must be 32+ characters)
- Check token expiration settings
- Ensure token is included in Authorization header

### Email Not Sending

- Verify email credentials in `.env`
- Check email service logs
- System will work without email (emails logged to console)

## 📝 License

MIT

## 🤝 Contributing

This is a production-ready template. Customize as needed for your use case.

---

For detailed backend API documentation, see `server/README.md`.
