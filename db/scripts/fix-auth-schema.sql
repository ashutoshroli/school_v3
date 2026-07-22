-- ============================================================================
-- Fix Auth Schema - Add missing columns and create default super admin
-- Run this in Neon SQL Editor
-- ============================================================================

-- Step 1: Add missing columns to global.users table
-- ----------------------------------------------------------------------------

-- Add username column
ALTER TABLE global.users ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;

-- Add other missing columns for auth
ALTER TABLE global.users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE global.users ADD COLUMN IF NOT EXISTS user_role VARCHAR(50) DEFAULT 'user';
ALTER TABLE global.users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
ALTER TABLE global.users ADD COLUMN IF NOT EXISTS google_email VARCHAR(255);
ALTER TABLE global.users ADD COLUMN IF NOT EXISTS primary_branch_id INTEGER;
ALTER TABLE global.users ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE global.users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE global.users ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0;
ALTER TABLE global.users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE global.users ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255);
ALTER TABLE global.users ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITH TIME ZONE;
ALTER TABLE global.users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE global.users ADD COLUMN IF NOT EXISTS remember_token VARCHAR(255);
ALTER TABLE global.users ADD COLUMN IF NOT EXISTS remember_token_expires TIMESTAMP WITH TIME ZONE;

-- Update existing users to have username from email
UPDATE global.users 
SET username = SPLIT_PART(email, '@', 1) 
WHERE username IS NULL;

-- Step 2: Create user_branch_access table if not exists
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS global.user_branch_access (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES global.users(id) ON DELETE CASCADE,
    branch_id INTEGER REFERENCES global.branches(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES global.roles(id),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, branch_id)
);

-- Step 3: Create super_admins table
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS global.super_admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    google_id VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Create default super admin
-- Password: Admin@123
-- ----------------------------------------------------------------------------

INSERT INTO global.super_admins (username, email, password_hash, full_name)
VALUES (
    'admin',
    'admin@school.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.qVh.N0.J9N8YiW',
    'System Administrator'
)
ON CONFLICT (username) DO NOTHING;

-- Step 5: Create indexes
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_users_username ON global.users(username);
CREATE INDEX IF NOT EXISTS idx_users_is_deleted ON global.users(is_deleted);
CREATE INDEX IF NOT EXISTS idx_super_admins_username ON global.super_admins(username);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check super admin created
SELECT id, username, email, full_name FROM global.super_admins;

-- Check users table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'global' AND table_name = 'users'
ORDER BY ordinal_position;

-- ============================================================================
-- DONE! Now you can login with:
-- Username: admin
-- Password: Admin@123
-- ============================================================================
