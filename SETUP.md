# Setup Guide

## Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 9
- **Docker** & **Docker Compose**

### 1. Start the Database

```bash
docker-compose up -d
```

This starts PostgreSQL on port `5432` and pgAdmin on port `5050`.

- **pgAdmin**: http://localhost:5050  
  - Email: `admin@ordenatec.com` / Password: `admin`

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env if necessary (DATABASE_URL, JWT_SECRET, PORT)

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
# npm run seed

# Start the dev server
npm run dev
```

The backend runs on **http://localhost:3001** by default.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The frontend runs on **http://localhost:5173** by default.
