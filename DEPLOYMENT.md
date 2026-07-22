# Deployment Guide: Vercel + Neon + Render

## Quick Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   VERCEL    │────▶│   RENDER    │────▶│    NEON     │
│  (Frontend) │     │  (Backend)  │     │ (PostgreSQL)│
│  Next.js    │     │  Express.js │     │  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## Step 1: Set Up Neon Database

### 1.1 Create Neon Account
1. Go to **[neon.tech](https://neon.tech)**
2. Sign up with GitHub or email

### 1.2 Create Project
1. Click **"Create a project"**
2. Name: `school-erp`
3. Region: Choose closest to you
4. Click **"Create project"**

### 1.3 Get Connection String
- Copy the connection string (looks like `postgresql://...neon.tech/neondb?sslmode=require`)

### 1.4 Initialize Database
1. Go to **SQL Editor** in Neon dashboard
2. Copy the entire contents of `db/scripts/setup-neon.sql`
3. Paste and click **Run**
4. You should see "Database setup complete!"

---

## Step 2: Set Up Render Backend

### 2.1 Create Render Account
1. Go to **[render.com](https://render.com)**
2. Sign up with GitHub

### 2.2 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository `school_v3`
3. Configure:

| Setting | Value |
|---------|-------|
| Name | `school-erp-api` |
| Region | Oregon (or same as Neon) |
| Branch | `main` |
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | Free |

### 2.3 Add Environment Variables

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `your-neon-connection-string` |
| `JWT_SECRET` | `random-32-character-string` |
| `FRONTEND_URL` | `https://your-app.vercel.app` (add after step 3) |
| `NODE_ENV` | `production` |

### 2.4 Deploy
- Click **"Create Web Service"**
- Wait 2-3 minutes
- Your API: `https://school-erp-api.onrender.com`

---

## Step 3: Set Up Vercel Frontend

### 3.1 Create Vercel Account
1. Go to **[vercel.com](https://vercel.com)**
2. Sign up with GitHub

### 3.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Select `school_v3` repository
3. Configure:

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Root Directory | `frontend` |

### 3.3 Add Environment Variables

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://school-erp-api.onrender.com/api` |

### 3.4 Deploy
- Click **"Deploy"**
- Wait 1-2 minutes
- Your app: `https://school-v3.vercel.app`

---

## Step 4: Final Configuration

### 4.1 Update Render CORS
1. Go to Render dashboard
2. Update `FRONTEND_URL` with your Vercel URL
3. Redeploy

### 4.2 Test Your App
1. Visit your Vercel URL
2. Login with:
   - **Username**: `superadmin`
   - **Password**: `Admin@123`

---

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED
```
- Check `DATABASE_URL` is correct in Render
- Neon free tier pauses after inactivity (first request may be slow)

### CORS Error
```
Access-Control-Allow-Origin error
```
- Update `FRONTEND_URL` in Render
- Ensure it matches your Vercel URL exactly

### API Not Responding
- Free tier spins down after 15 min
- First request takes 30-60 seconds (cold start)
- Upgrade to Starter ($7/mo) for always-on

---

## Free Tier Limits

| Platform | Limit |
|----------|-------|
| Neon | 0.5 GB storage, 100 hrs/month |
| Render | 750 hrs/month, spins down |
| Vercel | 100 GB bandwidth/month |

---

## Production Upgrade

For 15,000 students/branch, upgrade to:
- **Neon Pro** ($19/mo) - More storage
- **Render Starter** ($7/mo) - No cold starts
- **Vercel Pro** ($20/mo) - Analytics
