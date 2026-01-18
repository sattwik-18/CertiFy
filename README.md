# Certify CLM | Secure Contract Lifecycle Management

A production-ready Contract Lifecycle Management (CLM) platform for institutions and enterprises to draft, manage, and secure contracts with blockchain-backed integrity.

## 🌟 Features

*   **Contract Lifecycle Management**: Draft, review, approve, and finalize contracts in a unified workspace.
*   **Blockchain Integrity**: Every finalized contract is hashed and anchored on the blockchain for immutable proof of existence and integrity.
*   **Public Verification**: Anyone can verify a contract's authenticity instantly using its unique ID or QR code without needing an account.
*   **Version Control**: Track contract versions and history with complete audit trails.
*   **Role-Based Access**: Granular permissions for Contract Owners, Managers, and Stakeholders.
*   **Secure Infrastructure**: Enterprise-grade security with encrypted storage and RLS (Row Level Security).

## 🏗️ Architecture & Technology Stack

This is a modern full-stack application built with:

*   **Frontend**: React + TypeScript + Vite + Tailwind CSS (Futuristic UI/UX)
*   **Backend**: Node.js + Supabase (PostgreSQL + Auth + Realtime)
*   **Blockchain**: Ethereum/Hardhat (Smart Contracts for Integrity)
*   **Security**: Row Level Security (RLS), JWT Authentication, AES-256 Encryption

## 📁 Project Structure

```
CertiFy/
├── server/                 # Blockchain & Backend Logic
│   ├── contracts/         # Solidity Smart Contracts
│   ├── scripts/           # Deployment & Test Scripts
│   └── hardhat.config.js  # Blockchain Config
├── src/                   # Frontend Application
│   ├── components/        # React UI Components
│   ├── services/          # Supabase & API Services
│   └── hooks/             # Custom Hooks (Realtime)
├── db_scripts/            # SQL Database Schemas & Migrations
└── App.tsx                # Main Application Entry
```

## 🚀 Quick Start

### Prerequisites

*   Node.js 18+ and npm
*   A Supabase project (for Database & Auth)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/sattwik-18/CertiFy.git
cd CertiFy

# Install dependencies (Root)
npm install

# Install dependencies (Server/Blockchain)
cd server
npm install
cd ..
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_key
VITE_GROQ_API_KEY=your_groq_key
```

### 3. Run the Application

```bash
# Start the frontend development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📡 Blockchain Integration

The platform uses a hybrid approach:
1.  **Off-chain Storage**: Contract metadata and files are stored securely in Supabase.
2.  **On-chain Proof**: A hash of the contract is published to the blockchain.

To deploy the smart contracts (local Hardhat network):

```bash
cd server
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

## 📝 License

MIT
