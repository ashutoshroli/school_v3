# School ERP Backend API

Express.js REST API for the Multi-Branch School Management ERP.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials

# Start server
npm run dev
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `PORT` | Server port (default: 3000) | No |

## API Endpoints

### Authentication
- `POST /api/auth/login/super-admin` - Super Admin login
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get profile
- `POST /api/auth/logout` - Logout

### Branches
- `GET /api/branches` - List all branches
- `GET /api/branches/:id` - Get branch by ID
- `POST /api/branches` - Create branch
- `GET /api/branches/:id/settings` - Get settings
- `GET /api/branches/:id/stats` - Get statistics

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.
