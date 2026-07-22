# Multi-Branch School Management ERP

A comprehensive, multi-tenant school management system designed for educational institutions with multiple branches.

## 🚀 Quick Deployment

### Option 1: Vercel + Neon + Render (Recommended)

| Platform | Purpose | Free Tier |
|----------|---------|-----------|
| [Neon](https://neon.tech) | PostgreSQL Database | 0.5 GB |
| [Render](https://render.com) | Backend API | 750 hrs/month |
| [Vercel](https://vercel.com) | Frontend | 100 GB bandwidth |

### Quick Start

```bash
# 1. Database Setup
# Run db/scripts/setup-neon.sql in Neon SQL Editor

# 2. Backend Setup
cd backend && npm install && npm run dev

# 3. Frontend Setup
cd frontend && npm install && npm run dev
```

## 📁 Project Structure

```
school_v3/
├── db/           # Database schemas and migrations
├── backend/      # Express.js API
└── frontend/     # Next.js PWA
```

## 🔐 Default Login

- **Username**: `superadmin`
- **Password**: `Admin@123`

## 📖 Full Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.
