# Setup script to create .env file if it doesn't exist
$envContent = @"
# Server Configuration
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Database (Using SQLite for local development - easier setup)
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET=dev-jwt-secret-key-change-in-production-min-32-chars-long
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Email Configuration (Optional - will log to console if not configured)
EMAIL_HOST=
EMAIL_PORT=
EMAIL_SECURE=false
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=noreply@certify.app

# Blockchain Configuration
BLOCKCHAIN_NETWORK=ethereum
BLOCKCHAIN_RPC_URL=
BLOCKCHAIN_EXPLORER_URL=
BLOCKCHAIN_PRIVATE_KEY=
USE_MOCK_BLOCKCHAIN=true

# File Upload
MAX_FILE_SIZE=20971520
UPLOAD_DIR=./uploads
CERTIFICATES_DIR=./public/certificates

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URLs
VERIFY_PAGE_URL=http://localhost:3000/verify
"@

if (-not (Test-Path ".env")) {
    Set-Content -Path ".env" -Value $envContent
    Write-Host ".env file created successfully!"
} else {
    Write-Host ".env file already exists. Skipping creation."
}

