-- ============================================================================
-- Multi-Branch School Management ERP - Complete Database Setup Script
-- ============================================================================
-- This script sets up the entire database for Neon PostgreSQL
-- Run this in Neon SQL Editor to create all tables and seed data
-- ============================================================================

-- Step 1: Create schemas for multi-tenant architecture
-- ----------------------------------------------------------------------------

CREATE SCHEMA IF NOT EXISTS global;
CREATE SCHEMA IF NOT EXISTS branch_template;

-- ============================================================================
-- GLOBAL SCHEMA - Tables for managing all branches/tenants
-- ============================================================================

-- Step 2: Create global tables
-- ----------------------------------------------------------------------------

-- Branches/Tenants table
CREATE TABLE IF NOT EXISTS global.branches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    schema_name VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table (global users who can access multiple branches)
CREATE TABLE IF NOT EXISTS global.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE IF NOT EXISTS global.roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    description TEXT,
    permissions JSONB DEFAULT '[]',
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User-Branch-Role mapping (for multi-branch access)
CREATE TABLE IF NOT EXISTS global.user_branch_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES global.users(id) ON DELETE CASCADE,
    branch_id INTEGER REFERENCES global.branches(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES global.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, branch_id)
);

-- Plans/Subscription for SaaS model
CREATE TABLE IF NOT EXISTS global.plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    price_monthly DECIMAL(10, 2) DEFAULT 0,
    price_yearly DECIMAL(10, 2) DEFAULT 0,
    features JSONB DEFAULT '{}',
    limits JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Branch subscriptions
CREATE TABLE IF NOT EXISTS global.subscriptions (
    id SERIAL PRIMARY KEY,
    branch_id INTEGER REFERENCES global.branches(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES global.plans(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
    current_period_start DATE,
    current_period_end DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- BRANCH TEMPLATE SCHEMA - Template for each branch's data
-- ============================================================================

-- Students table
CREATE TABLE IF NOT EXISTS branch_template.students (
    id SERIAL PRIMARY KEY,
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    class_id INTEGER,
    section_id INTEGER,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred')),
    admission_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Student Parents/Guardians
CREATE TABLE IF NOT EXISTS branch_template.student_guardians (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES branch_template.students(id) ON DELETE CASCADE,
    relationship VARCHAR(20) NOT NULL CHECK (relationship IN ('father', 'mother', 'guardian', 'other')),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    occupation VARCHAR(100),
    address TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Classes/Grades
CREATE TABLE IF NOT EXISTS branch_template.classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    grade_level INTEGER,
    academic_year_id INTEGER,
    class_teacher_id INTEGER,
    room_number VARCHAR(20),
    capacity INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sections
CREATE TABLE IF NOT EXISTS branch_template.sections (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES branch_template.classes(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    teacher_id INTEGER,
    capacity INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subjects
CREATE TABLE IF NOT EXISTS branch_template.subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    type VARCHAR(20) DEFAULT 'theory' CHECK (type IN ('theory', 'practical', 'both')),
    max_marks INTEGER DEFAULT 100,
    pass_marks INTEGER DEFAULT 35,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Teachers/Staff
CREATE TABLE IF NOT EXISTS branch_template.staff (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    department VARCHAR(100),
    designation VARCHAR(100),
    joining_date DATE DEFAULT CURRENT_DATE,
    salary DECIMAL(12, 2),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'resigned', 'terminated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Teacher-Subject-Class mapping
CREATE TABLE IF NOT EXISTS branch_template.teacher_assignments (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES branch_template.staff(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES branch_template.subjects(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES branch_template.classes(id) ON DELETE CASCADE,
    section_id INTEGER REFERENCES branch_template.sections(id) ON DELETE CASCADE,
    academic_year_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Academic Years
CREATE TABLE IF NOT EXISTS branch_template.academic_years (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Terms/Semesters
CREATE TABLE IF NOT EXISTS branch_template.terms (
    id SERIAL PRIMARY KEY,
    academic_year_id INTEGER REFERENCES branch_template.academic_years(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Exams
CREATE TABLE IF NOT EXISTS branch_template.exams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    term_id INTEGER REFERENCES branch_template.terms(id) ON DELETE CASCADE,
    exam_type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Exam Schedule
CREATE TABLE IF NOT EXISTS branch_template.exam_schedule (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES branch_template.exams(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES branch_template.subjects(id),
    class_id INTEGER REFERENCES branch_template.classes(id),
    exam_date DATE,
    start_time TIME,
    end_time TIME,
    room_number VARCHAR(20),
    max_marks INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Student Results
CREATE TABLE IF NOT EXISTS branch_template.results (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES branch_template.students(id) ON DELETE CASCADE,
    exam_schedule_id INTEGER REFERENCES branch_template.exam_schedule(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5, 2),
    grade VARCHAR(10),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, exam_schedule_id)
);

-- Attendance
CREATE TABLE IF NOT EXISTS branch_template.attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES branch_template.students(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES branch_template.classes(id),
    section_id INTEGER REFERENCES branch_template.sections(id),
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    remarks TEXT,
    marked_by INTEGER REFERENCES branch_template.staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date)
);

-- Staff Attendance
CREATE TABLE IF NOT EXISTS branch_template.staff_attendance (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES branch_template.staff(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'half_day', 'leave')),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, date)
);

-- Fee Types
CREATE TABLE IF NOT EXISTS branch_template.fee_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    frequency VARCHAR(20) DEFAULT 'monthly' CHECK (frequency IN ('one_time', 'monthly', 'quarterly', 'yearly')),
    is_refundable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fee Structure
CREATE TABLE IF NOT EXISTS branch_template.fee_structure (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES branch_template.classes(id) ON DELETE CASCADE,
    fee_type_id INTEGER REFERENCES branch_template.fee_types(id),
    amount DECIMAL(10, 2) NOT NULL,
    academic_year_id INTEGER REFERENCES branch_template.academic_years(id),
    due_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Student Fees
CREATE TABLE IF NOT EXISTS branch_template.student_fees (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES branch_template.students(id) ON DELETE CASCADE,
    fee_structure_id INTEGER REFERENCES branch_template.fee_structure(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    due_amount DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid', 'waived')),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fee Payments
CREATE TABLE IF NOT EXISTS branch_template.fee_payments (
    id SERIAL PRIMARY KEY,
    student_fee_id INTEGER REFERENCES branch_template.student_fees(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    received_by INTEGER REFERENCES branch_template.staff(id),
    receipt_number VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Announcements/Notices
CREATE TABLE IF NOT EXISTS branch_template.announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'urgent', 'event', 'holiday')),
    target_audience VARCHAR(50) DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'staff', 'parents')),
    publish_date DATE,
    expiry_date DATE,
    created_by INTEGER REFERENCES branch_template.staff(id),
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events
CREATE TABLE IF NOT EXISTS branch_template.events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50),
    start_datetime TIMESTAMP WITH TIME ZONE,
    end_datetime TIMESTAMP WITH TIME ZONE,
    venue VARCHAR(255),
    is_all_day BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'scheduled',
    created_by INTEGER REFERENCES branch_template.staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default roles
INSERT INTO global.roles (name, display_name, description, permissions, is_system) VALUES
('super_admin', 'Super Administrator', 'Full system access', '["*"]', TRUE),
('admin', 'Administrator', 'Branch administrator', '["users.*", "students.*", "staff.*", "classes.*", "attendance.*", "fees.*", "reports.*"]', TRUE),
('principal', 'Principal', 'Branch principal', '["students.read", "staff.read", "classes.*", "attendance.*", "reports.*"]', TRUE),
('teacher', 'Teacher', 'Teaching staff', '["students.read", "attendance.create", "attendance.read", "results.*"]', TRUE),
('accountant', 'Accountant', 'Fee management', '["fees.*", "students.read"]', TRUE),
('student', 'Student', 'Student user', '["self.read", "results.read", "attendance.read"]', TRUE),
('parent', 'Parent', 'Parent/Guardian', '["children.read", "results.read", "attendance.read"]', TRUE)
ON CONFLICT (name) DO NOTHING;

-- Insert default plans
INSERT INTO global.plans (name, code, price_monthly, price_yearly, features, limits) VALUES
('Free', 'free', 0, 0, 
 '{"students": true, "staff": true, "attendance": true, "fees": true}',
 '{"students": 50, "staff": 10, "storage_mb": 100}'),
('Basic', 'basic', 29.99, 299.99,
 '{"students": true, "staff": true, "attendance": true, "fees": true, "reports": true, "sms": true}',
 '{"students": 500, "staff": 50, "storage_mb": 1000}'),
('Pro', 'pro', 79.99, 799.99,
 '{"students": true, "staff": true, "attendance": true, "fees": true, "reports": true, "sms": true, "email": true, "api": true}',
 '{"students": 2000, "staff": 200, "storage_mb": 5000}'),
('Enterprise', 'enterprise', 199.99, 1999.99,
 '{"*": true}',
 '{"students": 10000, "staff": 500, "storage_mb": 50000}')
ON CONFLICT (code) DO NOTHING;

-- Insert default branch (Main Branch)
INSERT INTO global.branches (name, code, schema_name, status, settings) VALUES
('Main Branch', 'MAIN', 'branch_main', 'active', '{"address": "Main Campus", "phone": "+91-XXXXXXXXXX"}')
ON CONFLICT (code) DO NOTHING;

-- Insert default subjects
INSERT INTO branch_template.subjects (name, code, type, max_marks, pass_marks) VALUES
('Mathematics', 'MATH101', 'theory', 100, 35),
('English', 'ENG101', 'theory', 100, 35),
('Science', 'SCI101', 'both', 100, 35),
('Social Studies', 'SOC101', 'theory', 100, 35),
('Hindi', 'HIN101', 'theory', 100, 35),
('Computer Science', 'CS101', 'both', 100, 35),
('Physical Education', 'PE101', 'practical', 100, 35),
('Art', 'ART101', 'practical', 100, 35)
ON CONFLICT (code) DO NOTHING;

-- Insert fee types
INSERT INTO branch_template.fee_types (name, code, frequency, is_refundable) VALUES
('Tuition Fee', 'TUITION', 'monthly', FALSE),
('Admission Fee', 'ADMISSION', 'one_time', FALSE),
('Exam Fee', 'EXAM', 'quarterly', FALSE),
('Library Fee', 'LIBRARY', 'yearly', TRUE),
('Sports Fee', 'SPORTS', 'yearly', TRUE),
('Transport Fee', 'TRANSPORT', 'monthly', TRUE),
('Lab Fee', 'LAB', 'yearly', FALSE),
('Computer Fee', 'COMPUTER', 'yearly', FALSE)
ON CONFLICT (code) DO NOTHING;

-- Insert academic year
INSERT INTO branch_template.academic_years (name, start_date, end_date, is_current, status) VALUES
('2024-25', '2024-04-01', '2025-03-31', TRUE, 'active')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Global schema indexes
CREATE INDEX IF NOT EXISTS idx_branches_status ON global.branches(status);
CREATE INDEX IF NOT EXISTS idx_branches_code ON global.branches(code);
CREATE INDEX IF NOT EXISTS idx_users_email ON global.users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON global.users(status);
CREATE INDEX IF NOT EXISTS idx_user_branch_roles_user ON global.user_branch_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_branch_roles_branch ON global.user_branch_roles(branch_id);

-- Branch template indexes
CREATE INDEX IF NOT EXISTS idx_students_status ON branch_template.students(status);
CREATE INDEX IF NOT EXISTS idx_students_class ON branch_template.students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_admission ON branch_template.students(admission_number);
CREATE INDEX IF NOT EXISTS idx_staff_status ON branch_template.staff(status);
CREATE INDEX IF NOT EXISTS idx_staff_department ON branch_template.staff(department);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON branch_template.attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON branch_template.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_results_student ON branch_template.results(student_id);
CREATE INDEX IF NOT EXISTS idx_student_fees_status ON branch_template.student_fees(status);
CREATE INDEX IF NOT EXISTS idx_fee_payments_date ON branch_template.fee_payments(payment_date);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname IN ('global', 'branch_template') 
        AND column_exists(schemaname, tablename, 'updated_at')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', t, t);
        EXECUTE format('CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
    END LOOP;
END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these to verify setup
SELECT 'Branches table' as table_name, COUNT(*) as count FROM global.branches
UNION ALL
SELECT 'Roles table', COUNT(*) FROM global.roles
UNION ALL
SELECT 'Plans table', COUNT(*) FROM global.plans
UNION ALL
SELECT 'Subjects table', COUNT(*) FROM branch_template.subjects
UNION ALL
SELECT 'Fee types table', COUNT(*) FROM branch_template.fee_types;

-- ============================================================================
-- COMPLETE!
-- ============================================================================
-- Your School Management ERP database is now ready!
-- Next steps:
-- 1. Create branches via the admin panel or API
-- 2. Add users and assign roles
-- 3. Configure fee structures for each class
-- 4. Add students and staff
-- ============================================================================
