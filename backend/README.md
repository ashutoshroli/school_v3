# School ERP Backend API

Multi-Branch School Management ERP Backend built with Node.js, Express, and PostgreSQL.

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Google OAuth integration
  - Role-Based Access Control (RBAC)
  - Super Admin bypass capability

- 🏫 **Multi-Branch Architecture**
  - Schema-per-branch isolation
  - Branch-specific settings
  - Cross-branch operations

- 📊 **Core Modules**
  - Student & Staff Management
  - Attendance Tracking (RFID support)
  - Leave Management (2-level approval)
  - Fee Management & Payments
  - Exam & Marks Management
  - Dashboard Analytics

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Auth:** Passport.js, JWT
- **Validation:** Express Validator
- **Logging:** Winston

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
```

### Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE school_erp;
```

2. Run database migrations:
```bash
# From the /db folder
cd ../db
npm run init
npm run create-global
npm run create-branch-1
npm run seed-global
npm run seed-branch-1
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm start

# Run tests
npm test
```

## API Endpoints

### Authentication
```
POST   /api/auth/login/super-admin  - Super Admin login
POST   /api/auth/login               - User login
GET    /api/auth/google              - Google OAuth
GET    /api/auth/google/callback     - Google OAuth callback
POST   /api/auth/forgot-password     - Request password reset
POST   /api/auth/reset-password      - Reset password
POST   /api/auth/refresh-token       - Refresh JWT token
POST   /api/auth/logout              - Logout
GET    /api/auth/profile             - Get profile
PUT    /api/auth/profile             - Update profile
POST   /api/auth/change-password     - Change password
```

### Branches
```
GET    /api/branches                 - List branches
POST   /api/branches                 - Create branch
GET    /api/branches/:id             - Get branch
PUT    /api/branches/:id             - Update branch
DELETE /api/branches/:id             - Delete branch (Super Admin)
GET    /api/branches/:id/settings    - Get settings
PUT    /api/branches/:id/settings    - Update settings
GET    /api/branches/:id/stats       - Get statistics
```

### Students (Branch-scoped)
```
GET    /api/branches/:branchId/students           - List students
POST   /api/branches/:branchId/students           - Create student
GET    /api/branches/:branchId/students/:id       - Get student
PUT    /api/branches/:branchId/students/:id       - Update student
DELETE /api/branches/:branchId/students/:id       - Archive student
POST   /api/branches/:branchId/students/:id/assign-roll-number
```

### Staff (Branch-scoped)
```
GET    /api/branches/:branchId/staff           - List staff
POST   /api/branches/:branchId/staff           - Create staff
GET    /api/branches/:branchId/staff/:id       - Get staff
PUT    /api/branches/:branchId/staff/:id       - Update staff
DELETE /api/branches/:branchId/staff/:id       - Archive staff
```

### Attendance
```
GET    /api/branches/:branchId/attendance/student/:studentId
POST   /api/branches/:branchId/attendance/student
POST   /api/branches/:branchId/attendance/student/bulk
GET    /api/branches/:branchId/attendance/staff/:staffId
POST   /api/branches/:branchId/attendance/staff/rfid
GET    /api/branches/:branchId/attendance/summary
```

### Fees
```
GET    /api/branches/:branchId/fees/categories
POST   /api/branches/:branchId/fees/categories
GET    /api/branches/:branchId/fees/structure/:classId
POST   /api/branches/:branchId/fees/structure
GET    /api/branches/:branchId/fees/student/:studentId
POST   /api/branches/:branchId/fees/student
GET    /api/branches/:branchId/fees/payments/:studentId
POST   /api/branches/:branchId/fees/payments
POST   /api/branches/:branchId/fees/waiver
```

### Leave Management
```
GET    /api/branches/:branchId/leaves/types
GET    /api/branches/:branchId/leaves/balance/:staffId
GET    /api/branches/:branchId/leaves
POST   /api/branches/:branchId/leaves
POST   /api/branches/:branchId/leaves/:leaveId/approve
```

### Exams
```
GET    /api/branches/:branchId/exams/types
GET    /api/branches/:branchId/exams
POST   /api/branches/:branchId/exams
PUT    /api/branches/:branchId/exams/:examId/status
GET    /api/branches/:branchId/exams/:examId/schedule
POST   /api/branches/:branchId/exams/schedule
GET    /api/branches/:branchId/exams/schedule/:examScheduleId/marks
POST   /api/branches/:branchId/exams/marks
POST   /api/branches/:branchId/exams/schedule/:examScheduleId/verify
GET    /api/branches/:branchId/exams/:examId/report/:studentId
```

### Dashboard
```
GET    /api/branches/:branchId/dashboard/super-admin
GET    /api/branches/:branchId/dashboard
GET    /api/branches/:branchId/dashboard/teacher/:staffId
GET    /api/branches/:branchId/dashboard/student/:studentId
GET    /api/branches/:branchId/dashboard/parent/:parentId
```

## Role Hierarchy

```
super_admin   - Full access, can delete anything
admin         - Create/Edit everything, soft-delete only
director      - Same as admin
principal     - Branch-scoped, full control within branch
vp            - Branch-scoped, reports to principal
staff/teacher - Scoped to own class/subject
accountant    - Fee management
parent        - View own children's data
student       - View own data
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | school_erp |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | - |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRES_IN | Token expiry | 7d |
| GOOGLE_CLIENT_ID | Google OAuth client ID | - |
| GOOGLE_CLIENT_SECRET | Google OAuth secret | - |
| SMTP_HOST | Email server host | smtp.gmail.com |
| SMTP_PORT | Email server port | 587 |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

## License

MIT
