# 🚀 Guia de Instalacion Local — OrdenaTEC v2.0

> Tutorial paso a paso para montar el proyecto OrdenaTEC en tu maquina local.

---

## Requisitos Previos

Antes de empezar, asegurate de tener instalado lo siguiente:

| Herramienta | Version Minima | Verificar con | Descargar |
|-------------|----------------|---------------|-----------|
| **Node.js** | 20.0.0 | `node -v` | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.0.0 | `npm -v` | Viene con Node.js |
| **Docker Desktop** | Cualquiera reciente | `docker -v` | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/) |
| **Git** | Cualquiera | `git --version` | [git-scm.com](https://git-scm.com/) |

> ⚠️ **IMPORTANTE:** Docker Desktop debe estar **corriendo** (abierto) antes de iniciar el paso 1.

---

## Paso 1 — Clonar el repositorio

Si todavia no tienes el proyecto en tu maquina:

```bash
git clone <URL_DEL_REPOSITORIO>
cd ordenatec
```

Si ya lo tienes, simplemente asegurate de estar en la rama correcta:

```bash
cd ordenatec
git pull origin main
```

---

## Paso 2 — Levantar la base de datos con Docker

Desde la raiz del proyecto (`ordenatec/`), ejecuta:

```bash
docker-compose up -d
```

Esto levanta dos contenedores:

| Servicio | Puerto | Descripcion |
|----------|--------|-------------|
| **PostgreSQL 15** | `localhost:5432` | Base de datos principal |
| **pgAdmin 4** | `localhost:5050` | Interfaz web para gestionar la BD |

**Para verificar que esten corriendo:**

```bash
docker ps
```

Deberias ver `ordenatec_db` y `ordenatec_pgadmin` en estado `Up`.

> 💡 **pgAdmin** (opcional): Puedes acceder a `http://localhost:5050` con:
> - Email: `admin@ordenatec.com`
> - Password: `admin`

---

## Paso 3 — Configurar el Backend

### 3.1 Ir a la carpeta del backend

```bash
cd backend
```

### 3.2 Instalar dependencias

```bash
npm install
```

### 3.3 Crear el archivo de variables de entorno

Crea un archivo llamado `.env` dentro de `backend/` con este contenido:

```env
DATABASE_URL=postgresql://ordenatec:ordenatec_dev_password@localhost:5432/ordenatec
JWT_SECRET=clave-secreta-local-para-desarrollo-2026
PORT=3001
```

> ⚠️ **No cambies** el `DATABASE_URL` — debe coincidir con las credenciales del `docker-compose.yml`.

### 3.4 Generar el cliente de Prisma

```bash
npx prisma generate
```

### 3.5 Ejecutar las migraciones de la base de datos

```bash
npx prisma migrate dev
```

Si te pide un nombre para la migracion, escribe `init` y presiona Enter.

### 3.6 (Opcional) Cargar datos de prueba (Seed)

Para llenar la base de datos con 30 componentes de PC de ejemplo:

```bash
npm run seed
```

> 💡 **Recomendado** para la primera vez — sin esto, el catalogo estara vacio.

### 3.7 Iniciar el servidor del backend

```bash
npm run dev
```

**Si ves esto, el backend esta listo:**

```
============================================
  🖥️  OrdenaTEC API
  🚀 Servidor corriendo en http://localhost:3001
  📡 Health check: http://localhost:3001/api/health
============================================
```

> 🔍 **Verificacion rapida:** Abre `http://localhost:3001/api/health` en tu navegador — deberia responder `{"status":"ok",...}`.

**Deja esta terminal abierta** y abre una nueva para el frontend.

---

## Paso 4 — Configurar el Frontend

### 4.1 Ir a la carpeta del frontend (en una NUEVA terminal)

```bash
cd frontend
```

### 4.2 Instalar dependencias

```bash
npm install
```

### 4.3 Crear el archivo de variables de entorno

Crea un archivo llamado `.env` dentro de `frontend/` con este contenido:

```env
VITE_API_URL=http://localhost:3001/api
```

### 4.4 Iniciar el servidor del frontend

```bash
npm run dev
```

**Si ves algo como esto, esta listo:**

```
  VITE v5.x.x  ready in XXXms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

---

## Paso 5 — Abrir la aplicacion

🎉 **Abre tu navegador y ve a:**

### 👉 http://localhost:5173

Deberias ver la pagina de inicio de OrdenaTEC con el boton "Comenzar a armar".

---

## Resumen de Puertos

| Servicio | URL | Descripcion |
|----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Aplicacion web React |
| **Backend API** | http://localhost:3001 | API REST Express |
| **Health Check** | http://localhost:3001/api/health | Verificar estado del API |
| **PostgreSQL** | localhost:5432 | Base de datos (no se abre en navegador) |
| **pgAdmin** | http://localhost:5050 | Administrador de BD (opcional) |

---

## Comandos Utiles

### Detener todo

```bash
# Detener el frontend: Ctrl+C en su terminal
# Detener el backend: Ctrl+C en su terminal

# Detener la base de datos:
docker-compose down
```

### Reiniciar la base de datos desde cero

```bash
docker-compose down -v         # Borra los datos
docker-compose up -d           # Levanta limpio
cd backend
npx prisma migrate dev         # Re-crea las tablas
npm run seed                   # Re-carga datos de prueba
```

### Ver la base de datos con Prisma Studio

```bash
cd backend
npx prisma studio
```

Abre una interfaz web en `http://localhost:5555` para ver y editar tablas directamente.

### Crear un usuario administrador

1. Registrate normalmente en la app (http://localhost:5173/register)
2. Abre Prisma Studio (`npx prisma studio`) o pgAdmin
3. En la tabla `usuarios`, cambia el campo `rol` de tu usuario de `CLIENTE` a `ADMIN`
4. Cierra sesion y vuelve a entrar — ahora veras el boton "📊 Admin" en la barra de navegacion

---

## Solucion de Problemas Comunes

### ❌ "Docker no esta corriendo"
- Abre Docker Desktop y espera a que diga "Docker is running"
- Luego vuelve a ejecutar `docker-compose up -d`

### ❌ "FATAL: La variable de entorno JWT_SECRET no esta definida"
- Asegurate de que el archivo `backend/.env` existe y tiene la linea `JWT_SECRET=...`

### ❌ "Can't reach database server at localhost:5432"
- Verifica que Docker esta corriendo: `docker ps`
- Si no aparece `ordenatec_db`, ejecuta: `docker-compose up -d`
- Espera 10 segundos y vuelve a intentar

### ❌ "Port 3001 already in use"
- Otro proceso esta usando el puerto. Cierra otras terminales de backend
- O cambia el puerto en `backend/.env`: `PORT=3002`
- (Recuerda actualizar `VITE_API_URL` en el frontend si cambias el puerto)

### ❌ "Port 5173 already in use"
- Cierra otras terminales de Vite, o el frontend usara automaticamente el siguiente puerto disponible (5174, etc.)

### ❌ El catalogo esta vacio (no hay componentes)
- Ejecuta el seed: `cd backend && npm run seed`

---

## Resumen Rapido (Para los impacientes)

```bash
# 1. Base de datos
docker-compose up -d

# 2. Backend (Terminal 1)
cd backend
npm install
# Crear backend/.env (ver paso 3.3)
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev

# 3. Frontend (Terminal 2)
cd frontend
npm install
# Crear frontend/.env (ver paso 4.3)
npm run dev

# 4. Abrir http://localhost:5173
```

---

> 📌 **OrdenaTEC v2.0** — Proyecto de Ingenieria de Software 2026
