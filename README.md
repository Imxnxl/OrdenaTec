# OrdenaTEC — E-Commerce PC Configurator

OrdenaTEC is a specialized e-commerce platform for selling computer components and custom PC builds. The core feature is an interactive **PC Builder** that guides the user step by step, validates hardware compatibility in real time, shows price and estimated power consumption, and suggests alternatives.

## Technology Stack

| Layer          | Technology                                       |
| -------------- | ------------------------------------------------ |
| **Backend**    | Node.js 20+, Express 4.18+, TypeScript 5+       |
| **ORM**        | Prisma 5+ with PostgreSQL 15                     |
| **Frontend**   | React 18+, Redux Toolkit 2+, React Router DOM 6+ |
| **Infra**      | Docker, Docker Compose                           |

---

## Getting Started

### Prerequisites

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

---

## Project Structure

```
ordenatec/
├── backend/          # Express + Prisma API
│   ├── prisma/       # Schema & migrations
│   └── src/          # Source code
├── frontend/         # React SPA
│   ├── public/       # Static assets
│   └── src/          # Source code
├── docker-compose.yml
└── README.md
```

---

## API Endpoints Overview

| Method | Endpoint                            | Description                          | Auth     |
| ------ | ----------------------------------- | ------------------------------------ | -------- |
| POST   | `/api/auth/register`                | Register a new user                  | Public   |
| POST   | `/api/auth/login`                   | Login and get JWT                    | Public   |
| GET    | `/api/componentes`                  | List components (with filters)       | Public   |
| GET    | `/api/componentes/:id`              | Get single component                 | Public   |
| POST   | `/api/componentes`                  | Create component                     | Admin    |
| PUT    | `/api/componentes/:id`              | Update component                     | Admin    |
| DELETE | `/api/componentes/:id`              | Delete component                     | Admin    |
| POST   | `/api/configuraciones`              | Save a configuration                 | User     |
| GET    | `/api/configuraciones/:id`          | Get configuration by ID              | User     |
| GET    | `/api/configuraciones/usuario`      | List user configurations             | User     |
| POST   | `/api/configuraciones/validar`      | Validate compatibility               | Public   |
| POST   | `/api/pedidos`                      | Create order from cart               | User     |
| GET    | `/api/pedidos`                      | List user orders                     | User     |
| GET    | `/api/pedidos/:id`                  | Get order details                    | User     |
| PUT    | `/api/pedidos/:id/estado`           | Update order status                  | Admin    |

---

## Scripts

### Backend

| Script          | Command            | Description                  |
| --------------- | ------------------ | ---------------------------- |
| `npm run dev`   | `ts-node-dev`      | Start dev server with reload |
| `npm run build` | `tsc`              | Compile TypeScript           |
| `npm start`     | `node dist/server` | Start production server      |
| `npm test`      | `jest`             | Run tests                    |

### Frontend

| Script          | Command       | Description         |
| --------------- | ------------- | ------------------- |
| `npm run dev`   | `vite`        | Start dev server    |
| `npm run build` | `vite build`  | Production build    |
| `npm run preview`| `vite preview`| Preview build      |

---

## Environment Variables

### Backend (`.env`)

```env
DATABASE_URL=postgresql://ordenatec:ordenatec_dev_password@localhost:5432/ordenatec
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3001
```

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:3001/api
```

---

## License

This project is for educational purposes — Software Engineering course project.
