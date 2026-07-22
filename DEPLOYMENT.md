# Deployment Guide - Multi-Branch School Management ERP

This guide covers deploying the School Management ERP on **Neon** (PostgreSQL), **Vercel** (Frontend), and **Render** (Backend).

---

## 🎯 Deployment Overview

| Component | Platform | Purpose |
|-----------|----------|---------|
| PostgreSQL Database | [Neon](https://neon.tech) | Serverless PostgreSQL with auto-scaling |
| Backend API | [Render](https://render.com) | Node.js Express API with WebSocket support |
| Frontend PWA | [Vercel](https://vercel.com) | Next.js 14 with PWA and Edge functions |

---

## 📋 Prerequisites

Before deploying, ensure you have:
- GitHub account (for repository connection)
- Neon account (free tier available)
- Vercel account (free tier available)
- Render account (free tier available)

---

## Phase 1: Database Setup (Neon)

### Step 1.1: Create Neon Project

1. Go to [Neon Console](https://console.neon.tech)
2. Click **"Create a project"**
3. Enter project name: `school-erp-db`
4. Select region closest to your users
5. Click **"Create project"**

### Step 1.2: Get Connection Details

After project creation, note down:
- **Connection string** (for backend)
- **Database name**: `neondb` (default)

Example connection string:
```
postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Step 1.3: Run Database Setup Script

1. In Neon Console, go to **SQL Editor**
2. Open `db/scripts/setup-neon.sql` from this repository
3. Copy the entire content
4. Paste and execute in SQL Editor

This script creates:
- ✅ `global` schema with tenant management tables
- ✅ `branch_template` schema for new branches
- ✅ Seed data for roles, permissions, and default admin

### Step 1.4: Verify Setup

Run this query to verify:
```sql
SELECT schema_name FROM information_schema.schemata 
WHERE schema_name IN ('global', 'branch_template');
```

---

## Phase 2: Backend Deployment (Render)

### Step 2.1: Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select `school_v3` repository

### Step 2.2: Configure Service

| Setting | Value |
|---------|-------|
| Name | `school-erp-backend` |
| Region | Same as Neon DB |
| Branch | `main` |
| Root Directory | `backend` |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | Free (or paid for production) |

### Step 2.3: Set Environment Variables

In Render dashboard, add these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production mode |
| `PORT` | `10000` | Render's port |
| `DATABASE_URL` | `<Neon connection string>` | From Neon console |
| `JWT_SECRET` | `<random-256-bit-secret>` | Generate with `openssl rand -hex 32` |
| `JWT_EXPIRES_IN` | `7d` | Token expiry |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Frontend URL for CORS |

### Step 2.4: Deploy

1. Click **"Create Web Service"**
2. Wait for build and deployment (2-3 minutes)
3. Note your backend URL: `https://school-erp-backend.onrender.com`

### Step 2.5: Verify Backend

Test health endpoint:
```bash
curl https://school-erp-backend.onrender.com/api/health
```

Expected response:
```json
{"status": "ok", "timestamp": "2024-..."}
```

---

## Phase 3: Frontend Deployment (Vercel)

### Step 3.1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import `school_v3` repository from GitHub

### Step 3.2: Configure Project

| Setting | Value |
|---------|-------|
| Framework Preset | `Next.js` |
| Root Directory | `frontend` |
| Build Command | `npm run build` (default) |
| Output Directory | `.next` (default) |

### Step 3.3: Set Environment Variables

Add these environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://school-erp-backend.onrender.com/api` |
| `NEXT_PUBLIC_APP_NAME` | `School Management ERP` |

### Step 3.4: Deploy

1. Click **"Deploy"**
2. Wait for deployment (1-2 minutes)
3. Your app will be live at: `https://school-erp.vercel.app`

### Step 3.5: Set Custom Domain (Optional)

1. In Vercel project settings, go to **Domains**
2. Add your custom domain
3. Update DNS records as instructed

---

## Phase 4: Post-Deployment Configuration

### Step 4.1: Update CORS

After frontend deployment, update backend CORS in Render:

```env
FRONTEND_URL=https://your-actual-frontend.vercel.app
```

### Step 4.2: Create First Admin User

Using SQL Editor in Neon:

```sql
INSERT INTO global.users (email, password_hash, role_id, branch_id)
VALUES (
  'admin@school.com',
  '$2b$12$...', -- Use bcrypt hash
  1, -- Admin role ID
  NULL -- Global admin
);
```

Or use the registration endpoint and update role manually.

### Step 4.3: Test Full Flow

1. Open frontend URL
2. Login with admin credentials
3. Verify dashboard loads
4. Test API calls in browser dev tools

---

## 🔧 Troubleshooting

### Database Connection Issues

**Symptom**: Backend fails to start with DB connection error

**Solution**:
1. Verify `DATABASE_URL` is correct
2. Ensure Neon project is not suspended (free tier sleeps)
3. Check if IP is whitelisted (Neon allows all by default)

### CORS Errors

**Symptom**: Frontend can't call backend API

**Solution**:
1. Verify `FRONTEND_URL` in backend matches exactly
2. Include protocol: `https://` not just domain
3. Clear browser cache and try incognito

### JWT Token Issues

**Symptom**: Login succeeds but subsequent requests fail

**Solution**:
1. Verify `JWT_SECRET` is same across all backend instances
2. Check token expiry settings
3. Ensure Authorization header format: `Bearer <token>`

### Build Failures

**Symptom**: Deployment fails during build

**Solution**:
1. Check build logs for specific errors
2. Verify `package.json` scripts are correct
3. Run `npm run build` locally to debug

---

## 📊 Monitoring

### Backend Health Monitoring

Set up health checks in Render:
1. Go to your web service
2. Settings → Health Check Path: `/api/health`

### Database Monitoring

Neon provides:
- Query performance metrics
- Connection pool status
- Storage usage

### Frontend Analytics

Vercel provides:
- Page view analytics
- Performance metrics
- Error tracking

---

## 🔐 Security Checklist

- [ ] Changed all default passwords
- [ ] Generated strong JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Enabled HTTPS (automatic on Vercel/Render)
- [ ] Configured proper CORS origins
- [ ] Set up database connection pooling
- [ ] Enabled Neon's connection limits

---

## 💰 Cost Estimation (Monthly)

| Platform | Free Tier | Production |
|----------|-----------|------------|
| Neon | $0 (0.5GB storage) | $19+ (Pro) |
| Vercel | $0 (Hobby) | $20+ (Pro) |
| Render | $0 (Limited) | $7+ (Starter) |
| **Total** | **$0** | **$46+** |

---

## 📞 Support

- **Neon Docs**: https://neon.tech/docs
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs

---

## Next Steps

After successful deployment:

1. ✅ Set up CI/CD pipeline
2. ✅ Configure custom domain
3. ✅ Set up monitoring alerts
4. ✅ Create additional admin users
5. ✅ Add branches through admin panel
