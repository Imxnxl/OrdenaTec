# OrdenaTEC — E-Commerce PC Configurator v2.0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

OrdenaTEC is a specialized e-commerce platform for selling computer components and custom PC builds. The core feature is an interactive **PC Builder** that guides the user step by step, validates hardware compatibility in real time, shows price and estimated power consumption, and suggests alternatives.

## v2.0 Features (New)
*   **Premium Glassmorphism Design:** A modern, frosted-glass aesthetic across all cards, modals, and navigation components.
*   **Dynamic Backgrounds:** High-resolution abstract dynamic backgrounds that interact beautifully with the translucent UI elements.
*   **Enhanced Animations:** Smooth entry animations (FadeInUp, SlideIn, Bounce), hover glows, and satisfying button press interactions.
*   **Robust Deletion Security:** Custom delete modals requiring explicit "ELIMINAR" confirmation text to prevent accidental data loss.
*   **Hard Delete Architecture:** Fixed SKU conflicts by implementing true database cascade deletions, completely freeing up identifiers.
*   **Toast Notifications:** Real-time visual feedback for CRUD operations (Create, Edit, Delete).
*   **Inline Validation UI:** Backend Zod validation errors are now mapped directly to the frontend modal for easier user correction.
*   **Enhanced Admin Panel:** Dashboard with stats (revenue, orders by status, low stock alerts), order management with status updates, user management with role toggling, pre-built PC CRUD, and CSV export.
*   **Batch Checkout:** All cart items are now processed in a single transactional request, ensuring atomicity and preventing partial orders.
*   **Stock by Quantity:** Stock decrement now respects the item quantity (not just 1 per component).
*   **Rate Limiting:** API requests are rate-limited (200 req / 15 min per IP) for security.
*   **Error Boundary:** Global React error boundary catches rendering errors without crashing the whole app.
*   **Pre-armada Validation:** Admin cannot create/edit pre-built PCs without all required component types.
*   **Unit Tests:** 19 tests covering the compatibility engine (socket, RAM, PSU, dimensions, pricing, filtering).
*   **New Attribute Interfaces:** Added TypeScript interfaces for `AtributosAlmacenamientoExtra`, `AtributosSilla`, `AtributosMousepad`, `AtributosWebcam`, `AtributosMicrofono`, `AtributosBocinas`.
*   **Config DELETE Endpoint:** Users can now delete saved configurations via `DELETE /api/configuraciones/:id`.

## v1.0 Features (Foundation)
*   **Interactive PC Builder:** An 8-step wizard (CPU, Motherboard, RAM, GPU, Storage, Extra Storage, PSU, Case) with state management.
*   **Dual Storage Support:** Users can select both a primary and an extra (secondary) storage drive in the PC builder.
*   **Real-time Compatibility Engine:** Strict hardware validation (Socket types, RAM generations, Wattage limits, GPU dimensions).
*   **Smart Suggestions:** Recommends alternative compatible components if a selection causes a conflict.
*   **Cart & Checkout:** Dynamic pricing cart with simulated checkout and order generation.
*   **Admin Dashboard:** Full CRUD management for the hardware catalog and general statistics.
*   **JWT Authentication:** Secure login and registration system with role-based access control (Admin/Client).

---

## Getting Started

Please see the [Setup Guide (SETUP.md)](./SETUP.md) for detailed instructions on how to run the database, backend, and frontend locally.

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
| PUT    | `/api/configuraciones/:id`          | Update configuration                 | User     |
| DELETE | `/api/configuraciones/:id`          | Delete configuration                 | User     |
| GET    | `/api/configuraciones/usuario`      | List user configurations             | User     |
| POST   | `/api/configuraciones/validar`      | Validate compatibility               | Public   |
| POST   | `/api/pedidos`                      | Create order from cart               | User     |
| POST   | `/api/pedidos/batch`                | Create multiple orders in transaction | User     |
| GET    | `/api/pedidos`                      | List user orders                     | User     |
| GET    | `/api/pedidos/:id`                  | Get order details                    | User     |
| PUT    | `/api/pedidos/:id/estado`           | Update order status                  | Admin    |
| GET    | `/api/admin/estadisticas`           | Dashboard stats                      | Admin    |
| GET    | `/api/admin/pedidos`                | List all orders (paginated)          | Admin    |
| PUT    | `/api/admin/pedidos/:id/estado`     | Update any order status              | Admin    |
| GET    | `/api/admin/usuarios`               | List all users                       | Admin    |
| PUT    | `/api/admin/usuarios/:id/rol`       | Change user role                     | Admin    |
| POST   | `/api/admin/prearmadas`             | Create pre-built PC                  | Admin    |
| PUT    | `/api/admin/prearmadas/:id`         | Update pre-built PC                  | Admin    |
| DELETE | `/api/admin/prearmadas/:id`         | Delete pre-built PC                  | Admin    |
| GET    | `/api/admin/exportar/componentes`   | Export catalog as CSV                | Admin    |

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
