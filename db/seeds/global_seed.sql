-- Global Seed Data

-- Default Super Admin (password: Admin@123)
INSERT INTO global.super_admins (email, username, password_hash, full_name, phone, is_active, bypass_all_permissions)
VALUES (
    'superadmin@school.edu',
    'superadmin',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.aO4.Vv7hMYKNm.',
    'Super Administrator',
    '+91-9999999999',
    TRUE,
    TRUE
);

-- Default Configurations
INSERT INTO global.configurations (key, value, description) VALUES
('school_name', '"Multi-Branch School ERP"', 'School name'),
('max_branches', '10', 'Maximum branches allowed'),
('grace_period_days', '3', 'Late fee grace period');

-- First Branch
INSERT INTO global.branches (
    branch_code, branch_name, schema_name, address, city, state, pincode,
    phone, email, max_students, max_staff, status
) VALUES (
    'BR001', 'Main Campus', 'branch_1',
    '123 Education Lane', 'Mumbai', 'Maharashtra', '400001',
    '+91-22-12345678', 'main@school.edu',
    15000, 500, 'active'
);

-- Create branch_1 schema
CREATE SCHEMA IF NOT EXISTS branch_1;
