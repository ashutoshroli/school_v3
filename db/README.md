# School ERP Database

## Architecture Overview

This database uses a **schema-per-branch model** for multi-tenant isolation:

- **`global` schema**: Branch registry, Super Admin, cross-branch configuration
- **`branch_1`, `branch_2`, ... schemas**: Each branch has its own complete table set

## Directory Structure

```
/db
├── README.md                    # This file
├── init.sql                     # Initialize database with extensions and types
├── schemas/
│   ├── global_schema.sql        # Global/control schema
│   └── branch_template.sql      # Template schema for cloning new branches
├── migrations/
│   └── *.sql                    # Migration files
├── seeds/
│   ├── global_seed.sql          # Seed data for global schema
│   └── branch_seed.sql          # Template seed data for new branches
└── scripts/
    ├── create_branch.sql        # Script to create a new branch schema
    └── clone_branch.sql         # Function to clone branch template
```

## Branch Independence Principle

Every branch is fully independent by default:
- Own fee structure
- Own HR policies
- Own scholarship policies
- Own academic calendar
- Own timetable rules

Nothing is shared across branches except explicit transfer-related exceptions.

## Roles & Permissions

```
Super Admin    → Global schema, can delete anything
Admin/Director → Create/Edit everything, soft-delete only
Principal/VP   → Scoped to own branch, full control within branch
Staff/Teacher  → Scoped to own class/subject/cabin
Parent/Student → Scoped to own data
```

## Setup

1. Run `init.sql` to create extensions and types
2. Run `global_schema.sql` to create the control schema
3. Run `branch_template.sql` to create the template
4. Use `create_branch.sql` to add new branches
