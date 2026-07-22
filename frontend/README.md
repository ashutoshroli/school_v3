# School ERP Frontend

Multi-Branch School Management ERP Frontend built with Next.js 14, React 18, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Modern UI**
  - Responsive design (mobile-first)
  - Tailwind CSS styling
  - Dark/Light mode ready
  - PWA support

- 🔐 **Authentication**
  - JWT token-based auth
  - Google OAuth integration
  - Protected routes
  - Role-based access

- 📊 **Dashboard**
  - Real-time statistics
  - Attendance overview
  - Fee collection tracking
  - Quick actions

- 👥 **Modules**
  - Student Management
  - Staff Management
  - Attendance Tracking
  - Fee Management
  - Exam & Results
  - Leave Management
  - Transport
  - Library
  - Hostel

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Data Fetching:** TanStack Query
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Forms:** Formik + Yup
- **Charts:** Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your configuration
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── dashboard/    # Dashboard page
│   │   ├── students/     # Student management
│   │   ├── staff/        # Staff management
│   │   ├── attendance/   # Attendance tracking
│   │   ├── fees/         # Fee management
│   │   ├── exams/        # Exam & results
│   │   ├── leave/        # Leave management
│   │   ├── settings/     # Settings
│   │   ├── login/        # Login page
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page (redirects)
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── layout/      # Layout components
│   │   ├── forms/       # Form components
│   │   └── dashboard/   # Dashboard widgets
│   ├── lib/
│   │   ├── api.ts        # API client & endpoints
│   │   └── utils.ts      # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Zustand stores
│   ├── types/            # TypeScript types
│   └── styles/           # Global styles
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:3000/api |
| NEXT_PUBLIC_GOOGLE_CLIENT_ID | Google OAuth Client ID | - |
| NEXT_PUBLIC_APP_NAME | Application name | School ERP |

## Pages

### Public Pages
- `/login` - Login page
- `/forgot-password` - Password recovery

### Protected Pages
- `/dashboard` - Main dashboard
- `/students` - Student management
- `/staff` - Staff management
- `/attendance` - Attendance tracking
- `/fees` - Fee management
- `/exams` - Exam & results
- `/leave` - Leave management
- `/transport` - Transport management
- `/library` - Library management
- `/hostel` - Hostel management
- `/settings` - System settings

## PWA Configuration

The app is configured as a Progressive Web App with:
- Offline support
- Install prompt
- Push notifications (ready)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
