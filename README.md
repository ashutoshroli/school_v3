# Multi-Branch School Management ERP

A comprehensive, multi-tenant school management system designed for educational institutions with multiple branches. Built with modern technologies for scalability, maintainability, and performance.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                        │
│  React 18 + TypeScript + Tailwind CSS + PWA                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (Express.js)                      │
│  Node.js + JWT Auth + RBAC + REST API                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE (PostgreSQL)                        │
│  Schema-per-branch isolation + Global control schema            │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
school_v3/
├── db/                    # Database layer
│   ├── schemas/           # SQL schemas
│   │   ├── global_schema.sql
│   │   └── branch_template.sql
│   ├── seeds/             # Seed data
│   ├── migrations/        # Migration scripts
│   ├── scripts/           # Utility scripts
│   └── test/              # Database tests
│
├── backend/               # API server
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth, RBAC, validation
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utilities
│   └── tests/             # API tests
│
└── frontend/              # Web application
    ├── src/
    │   ├── app/           # Next.js pages
    │   ├── components/    # React components
    │   ├── lib/           # API client, utilities
    │   ├── store/         # State management
    │   └── styles/        # CSS styles
    └── public/            # Static assets
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Database Setup

```bash
cd db

# Create PostgreSQL database
createdb school_erp

# Run initialization
psql -d school_erp -f init.sql
psql -d school_erp -f schemas/global_schema.sql
psql -d school_erp -f schemas/branch_template.sql
psql -d school_erp -f seeds/global_seed.sql
psql -d school_erp -f seeds/branch_seed.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Default Super Admin: `superadmin` / `Admin@123`

## 📊 Features

### Core Modules

| Module | Description |
|--------|-------------|
| **Authentication** | JWT + Google OAuth, role-based access control |
| **Branch Management** | Multi-branch with schema isolation |
| **Student Management** | Admission, records, transfers |
| **Staff Management** | Employee records, payroll |
| **Attendance** | RFID-based, period-wise tracking |
| **Fee Management** | Categories, payments, waivers |
| **Exam Module** | Scheduling, marks, report cards |
| **Leave Management** | 2-level approval, balance tracking |
| **Transport** | Routes, vehicles, GPS tracking |
| **Library** | Books, issues, fines |
| **Hostel** | Rooms, allotment, attendance |
| **Mess** | Menu, billing, guest meals |
| **Canteen** | Inventory, wallet, orders |
| **Lab Management** | Equipment, consumables |
| **Inventory** | School-wide asset management |

### Role Hierarchy

```
Super Admin  → Full access, can delete anything
Admin/Director → Create/Edit everything, soft-delete only
Principal/VP → Branch-scoped, full control within branch
Staff/Teacher → Scoped to own class/subject
Parent/Student → Scoped to own data
```

## 🗄️ Database Architecture

### Schema-per-Branch Model

- **Global Schema**: Branch registry, users, transfers, audit logs
- **Branch Schemas** (branch_1, branch_2, ...): Complete isolation per branch
- **60+ Tables** covering all modules
- **18 Custom ENUM Types** for type safety

### Key Tables

- `global.branches` - Branch registry
- `global.users` - Cross-branch user accounts
- `global.super_admins` - Super admin accounts
- `branch_N.students` - Student records
- `branch_N.staff` - Staff records
- `branch_N.attendance` - Attendance records
- `branch_N.fees` - Fee management

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/login/super-admin
POST /api/auth/login
GET  /api/auth/google
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Branches
```
GET    /api/branches
POST   /api/branches
GET    /api/branches/:id
PUT    /api/branches/:id
DELETE /api/branches/:id
```

### Students (Branch-scoped)
```
GET    /api/branches/:branchId/students
POST   /api/branches/:branchId/students
GET    /api/branches/:branchId/students/:id
PUT    /api/branches/:branchId/students/:id
DELETE /api/branches/:branchId/students/:id
```

... and many more endpoints for staff, attendance, fees, exams, leave, etc.

## 🎨 Frontend Features

- **Responsive Design**: Mobile-first, works on all devices
- **PWA Support**: Installable, offline-capable
- **Modern UI**: Tailwind CSS, component library
- **State Management**: Zustand stores
- **Data Fetching**: Axios with interceptors
- **Type Safety**: TypeScript throughout

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Helmet.js security headers
- CORS configuration
- Role-based access control
- Super Admin bypass capability

## 📈 Scalability

- Schema-per-branch isolation
- Connection pooling
- Stateless API design
- Caching ready
- Horizontal scaling support

## 🧪 Testing

```bash
# Database tests
cd db && npm test

# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, Passport.js, JWT |
| Database | PostgreSQL 14+ |
| Auth | JWT, Google OAuth 2.0 |
| State | Zustand |
| HTTP | Axios |

## 📝 License

MIT

## 👥 Authors

School ERP Team
