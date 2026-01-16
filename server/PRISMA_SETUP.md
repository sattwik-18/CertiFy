# Prisma Database Setup Guide

## Initial Setup

1. **Install Prisma CLI** (if not already installed):
   ```bash
   npm install -D prisma
   ```

2. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

3. **Create Initial Migration**:
   ```bash
   npm run prisma:migrate
   ```
   
   This will:
   - Create a `migrations/` directory
   - Generate SQL migration files
   - Apply the migration to your database
   - Regenerate Prisma Client

## Database Schema

The schema is defined in `prisma/schema.prisma`. Key models:

- **User**: Organization users with roles (Admin, Staff, Viewer)
- **Organization**: Certificate-issuing institutions
- **Certificate**: Digital certificates with blockchain hashes
- **Template**: Certificate design templates
- **BlockchainRecord**: Blockchain transaction records
- **VerificationLog**: Public verification tracking
- **ActivityLog**: Organization activity audit trail

## Common Commands

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create and apply migration
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# View database status
npx prisma migrate status
```

## Production Deployment

1. **Generate migration for production**:
   ```bash
   npx prisma migrate deploy
   ```

2. **Generate Prisma Client in production**:
   ```bash
   npm run prisma:generate
   ```

## Troubleshooting

### Migration conflicts
If you have migration conflicts:
```bash
# Reset and recreate
npx prisma migrate reset
npm run prisma:migrate
```

### Database connection issues
- Verify `DATABASE_URL` in `.env`
- Check PostgreSQL is running
- Verify user has CREATE/DROP permissions

### Schema changes
After modifying `schema.prisma`:
1. Create migration: `npm run prisma:migrate`
2. This will generate and apply SQL changes

