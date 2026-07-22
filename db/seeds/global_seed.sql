-- Global Seed Data for School ERP
-- Run after global_schema.sql

-- ============================================================================
-- SUPER ADMIN ACCOUNT
-- ============================================================================

-- Default password: Admin@123 (bcrypt hash)
INSERT INTO global.super_admins (
    email,
    username,
    password_hash,
    full_name,
    phone,
    is_active,
    bypass_all_permissions
) VALUES (
    'superadmin@school.edu',
    'superadmin',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.aO4.Vv7hMYKNm.',
    'Super Administrator',
    '+91-9999999999',
    TRUE,
    TRUE
);

-- ============================================================================
-- DEFAULT CONFIGURATION
-- ============================================================================

INSERT INTO global.configurations (key, value, description, is_public) VALUES
('school_name', '"Multi-Branch School ERP"', 'School name displayed in the system', true),
('school_logo', '"/images/logo.png"', 'School logo path', true),
('max_branches', '10', 'Maximum number of branches allowed', false),
('academic_year_start_month', '4', 'Academic year start month (April = 4)', true),
('default_week_start', '"monday"', 'Default week start day', true),
('grace_period_days', '3', 'Grace period for late fees in days', true),
('max_login_attempts', '5', 'Maximum login attempts before lockout', false),
('lockout_duration_minutes', '30', 'Account lockout duration in minutes', false),
('password_reset_expiry_hours', '24', 'Password reset link expiry in hours', false),
('remember_me_duration_days', '30', 'Remember me token duration in days', false),
('session_timeout_minutes', '60', 'Session timeout in minutes', false),
('min_password_length', '8', 'Minimum password length', false),
('require_password_uppercase', 'true', 'Require uppercase letter in password', false),
('require_password_lowercase', 'true', 'Require lowercase letter in password', false),
('require_password_number', 'true', 'Require number in password', false),
('require_password_special', 'true', 'Require special character in password', false);

-- ============================================================================
-- NOTIFICATION TEMPLATES
-- ============================================================================

INSERT INTO global.notification_templates (template_code, template_name, subject, body, variables, email_enabled, push_enabled) VALUES
('welcome_user', 'Welcome New User', 'Welcome to {school_name}', 
 'Dear {name},\n\nWelcome to {school_name}! Your account has been created.\n\nUsername: {username}\nPassword: {password}\n\nPlease change your password after first login.\n\nRegards,\n{school_name} Team',
 '["name", "school_name", "username", "password"]'::jsonb, true, true),

('password_reset', 'Password Reset Request', 'Reset Your Password - {school_name}',
 'Dear {name},\n\nYou have requested to reset your password.\n\nClick the link below to reset:\n{reset_link}\n\nThis link will expire in {expiry_hours} hours.\n\nIf you did not request this, please ignore this email.\n\nRegards,\n{school_name} Team',
 '["name", "school_name", "reset_link", "expiry_hours"]'::jsonb, true, false),

('fee_reminder', 'Fee Payment Reminder', 'Fee Payment Due - {school_name}',
 'Dear {parent_name},\n\nThis is a reminder that the fee payment for {student_name} is due.\n\nAmount: ₹{amount}\nDue Date: {due_date}\n\nPlease make the payment to avoid late fees.\n\nRegards,\n{school_name} Team',
 '["parent_name", "student_name", "amount", "due_date", "school_name"]'::jsonb, true, true),

('exam_schedule', 'Exam Schedule Published', 'Exam Schedule - {exam_name}',
 'Dear {student_name},\n\nThe schedule for {exam_name} has been published.\n\nPlease check your dashboard for details.\n\nRegards,\n{school_name} Team',
 '["student_name", "exam_name", "school_name"]'::jsonb, true, true),

('result_published', 'Result Published', 'Your Result is Out - {exam_name}',
 'Dear {student_name},\n\nThe results for {exam_name} have been published.\n\nPlease check your dashboard for details.\n\nRegards,\n{school_name} Team',
 '["student_name", "exam_name", "school_name"]'::jsonb, true, true),

('leave_approved', 'Leave Request Approved', 'Leave Request Approved',
 'Dear {staff_name},\n\nYour leave request from {start_date} to {end_date} has been approved.\n\nRegards,\n{school_name} Team',
 '["staff_name", "start_date", "end_date", "school_name"]'::jsonb, true, true),

('leave_rejected', 'Leave Request Rejected', 'Leave Request Rejected',
 'Dear {staff_name},\n\nYour leave request from {start_date} to {end_date} has been rejected.\n\nReason: {rejection_reason}\n\nRegards,\n{school_name} Team',
 '["staff_name", "start_date", "end_date", "rejection_reason", "school_name"]'::jsonb, true, true),

('transfer_request', 'Branch Transfer Request', 'Branch Transfer Request',
 'Dear {principal_name},\n\nA transfer request has been initiated for {entity_name} from {from_branch} to {to_branch}.\n\nPlease review and take action.\n\nRegards,\n{school_name} Team',
 '["principal_name", "entity_name", "from_branch", "to_branch", "school_name"]'::jsonb, true, true),

('homework_assigned', 'New Homework Assigned', 'Homework: {subject_name}',
 'Dear {student_name},\n\nA new homework has been assigned for {subject_name}.\n\nDue Date: {due_date}\n\nPlease check your dashboard for details.\n\nRegards,\n{school_name} Team',
 '["student_name", "subject_name", "due_date", "school_name"]'::jsonb, true, true);

-- ============================================================================
-- BRANCH CREATION
-- ============================================================================

-- Create first branch (branch_1)
-- Note: The schema tables need to be created separately using branch_template.sql

INSERT INTO global.branches (
    branch_code,
    branch_name,
    schema_name,
    address,
    city,
    state,
    pincode,
    country,
    phone,
    email,
    website,
    established_date,
    board,
    max_students,
    max_staff,
    status
) VALUES (
    'BR001',
    'Main Campus',
    'branch_1',
    '123 Education Lane, Knowledge Park',
    'Mumbai',
    'Maharashtra',
    '400001',
    'India',
    '+91-22-12345678',
    'main@school.edu',
    'www.school.edu',
    '2000-06-01',
    'CBSE',
    15000,
    500,
    'active'
);

-- Create second branch (branch_2)
INSERT INTO global.branches (
    branch_code,
    branch_name,
    schema_name,
    address,
    city,
    state,
    pincode,
    country,
    phone,
    email,
    website,
    established_date,
    board,
    max_students,
    max_staff,
    status
) VALUES (
    'BR002',
    'North Campus',
    'branch_2',
    '456 Academic Avenue, Learning Valley',
    'Pune',
    'Maharashtra',
    '411001',
    'India',
    '+91-20-98765432',
    'north@school.edu',
    'www.school.edu',
    '2010-04-15',
    'CBSE',
    15000,
    450,
    'active'
);

-- Create third branch (branch_3)
INSERT INTO global.branches (
    branch_code,
    branch_name,
    schema_name,
    address,
    city,
    state,
    pincode,
    country,
    phone,
    email,
    website,
    established_date,
    board,
    max_students,
    max_staff,
    status
) VALUES (
    'BR003',
    'South Campus',
    'branch_3',
    '789 Scholar Street, Education Hub',
    'Bangalore',
    'Karnataka',
    '560001',
    'India',
    '+91-80-55667788',
    'south@school.edu',
    'www.school.edu',
    '2015-05-20',
    'CBSE',
    15000,
    400,
    'active'
);
