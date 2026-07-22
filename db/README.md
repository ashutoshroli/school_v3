# School ERP Database

PostgreSQL database with schema-per-branch architecture.

## Quick Setup for Neon

1. Create a Neon project at [neon.tech](https://neon.tech)
2. Go to SQL Editor
3. Run `db/scripts/setup-neon.sql`

This single script creates:
- All extensions and ENUM types
- Global schema (branches, users, super_admins)
- Branch schema with all tables
- Seed data (classes, sections, subjects, etc.)

## Default Login

- **Username**: `superadmin`
- **Password**: `Admin@123`

## Schema Structure

```
global.branches        - Branch registry
global.super_admins    - Super admin accounts
global.users           - User accounts
branch_1.*            - All branch tables
```

## Key Tables (per branch)

- `students` - Student records
- `staff` - Staff records
- `classes` - Class definitions
- `sections` - Section definitions
- `attendance_periods` - Period configuration
- `fee_categories` - Fee categories
- `leave_types` - Leave types
- `exam_types` - Exam types
