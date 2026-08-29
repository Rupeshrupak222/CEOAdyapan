# Adyapan Nexus – Enterprise Backend API Gateway

Production-grade Backend Gateway and Integration Layer for **Adyapan Nexus**, built with **Node.js, TypeScript, NestJS, Prisma ORM (PostgreSQL), and Redis Caching**.

---

## 🏛️ System Architecture

```
Frontend (Adyapan Nexus)
        │
        ▼ (JWT Bearer Token)
Adyapan Nexus Backend Gateway (:5000)
 ├── PostgreSQL (Prisma) -> Users, Roles, Sessions, Audit, Alerts
 ├── Redis Cache Engine  -> 60-second TTL caching with In-Memory fallback
 ├── CRM Gateway         -> https://adyapancrm.in (Auto-Login & Token Refresh)
 ├── HRMS Gateway        -> https://hrms.adyapan.com (Reverse-Engineered Integration)
 ├── LMS Module          -> https://lms.adyapan.com (Plug-and-Play Contract)
 └── Careers Gateway     -> https://carreradyapan.onrender.com
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Generate Prisma Client & Migrate
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Start Development Server
```bash
npm run start:dev
```
The gateway will start on **`http://localhost:5000`**.

---

## 🐳 Docker Deployment

To launch the complete production stack (NestJS Gateway + PostgreSQL 16 + Redis 7):

```bash
cd backend
docker-compose up -d --build
```

---

## 📡 API Reference & Endpoints

### 1. Unified Dashboard
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/overview` | Aggregates CRM, HRMS, LMS, Careers in parallel (< 2s load) |

### 2. Module Overviews
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/crm/overview` | Proxied & normalized CRM pipeline data |
| `GET` | `/api/hrms/overview` | Proxied & normalized HRMS employee metrics |
| `GET` | `/api/careers/overview` | Proxied Render Careers application metrics |
| `GET` | `/api/lms/overview` | Plug-and-play LMS cohort and course metrics |

### 3. Authentication & RBAC
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user, return JWT access + refresh tokens |
| `POST` | `/api/auth/refresh` | Rotate and issue new access token |
| `POST` | `/api/auth/logout` | Terminate session |
| `POST` | `/api/auth/change-password` | Update current user password |

### 4. Health & System Monitoring
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Gateway core health status |
| `GET` | `/api/health/crm` | Upstream CRM connection health |
| `GET` | `/api/health/hrms` | Upstream HRMS connection health |
| `GET` | `/api/health/lms` | Upstream LMS connection health |
| `GET` | `/api/health/careers` | Upstream Careers connection health |
| `GET` | `/api/audit-logs` | Audit trail of security events |
| `GET` | `/api/notifications` | Live outage and critical event alerts |
