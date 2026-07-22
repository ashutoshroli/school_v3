-- ============================================================================
-- QUICK SETUP SCRIPT FOR NEON DATABASE
-- Run this entire script in Neon SQL Editor
-- ============================================================================

-- STEP 1: Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- STEP 2: Create ENUM Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'director', 'principal', 'vp', 'staff', 'teacher', 'parent', 'student', 'accountant');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE status_type AS ENUM ('active', 'inactive', 'suspended', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'on_leave', 'late');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'partial', 'paid', 'overdue', 'waived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_cycle AS ENUM ('monthly', 'quarterly', 'half_yearly', 'yearly', 'one_time');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- STEP 3: Create Global Schema
CREATE SCHEMA IF NOT EXISTS global;

-- Branches Table
CREATE TABLE IF NOT EXISTS global.branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_code VARCHAR(20) UNIQUE NOT NULL,
    branch_name VARCHAR(200) NOT NULL,
    schema_name VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    phone VARCHAR(50),
    email VARCHAR(200),
    max_students INTEGER DEFAULT 15000,
    max_staff INTEGER DEFAULT 500,
    status status_type DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Super Admins Table
CREATE TABLE IF NOT EXISTS global.super_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(200) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    bypass_all_permissions BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Table
CREATE TABLE IF NOT EXISTS global.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(200) UNIQUE,
    username VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    google_id VARCHAR(200),
    user_role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    primary_branch_id UUID REFERENCES global.branches(id),
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Sessions Table
CREATE TABLE IF NOT EXISTS global.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES global.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- STEP 4: Create Branch Schema
CREATE SCHEMA IF NOT EXISTS branch_1;

-- Branch Settings
CREATE TABLE IF NOT EXISTS branch_1.branch_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year VARCHAR(20) NOT NULL,
    grading_system VARCHAR(20) DEFAULT 'marks',
    passing_percentage DECIMAL(5,2) DEFAULT 35.00,
    default_payment_cycle payment_cycle DEFAULT 'quarterly',
    grace_period_days INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes
CREATE TABLE IF NOT EXISTS branch_1.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_name VARCHAR(50) NOT NULL,
    class_code VARCHAR(20) UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sections
CREATE TABLE IF NOT EXISTS branch_1.sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES branch_1.classes(id) ON DELETE CASCADE,
    section_name VARCHAR(20) NOT NULL,
    capacity INTEGER DEFAULT 40,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, section_name)
);

-- Subjects
CREATE TABLE IF NOT EXISTS branch_1.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_name VARCHAR(200) NOT NULL,
    subject_code VARCHAR(20) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance Periods
CREATE TABLE IF NOT EXISTS branch_1.attendance_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period_number INTEGER NOT NULL,
    period_name VARCHAR(50),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_break BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fee Categories
CREATE TABLE IF NOT EXISTS branch_1.fee_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) NOT NULL,
    category_code VARCHAR(20) UNIQUE,
    is_mandatory BOOLEAN DEFAULT TRUE,
    payment_cycle payment_cycle DEFAULT 'quarterly',
    late_fee_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave Types
CREATE TABLE IF NOT EXISTS branch_1.leave_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leave_type VARCHAR(50) NOT NULL,
    leave_name VARCHAR(100) NOT NULL,
    default_days INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exam Types
CREATE TABLE IF NOT EXISTS branch_1.exam_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_type VARCHAR(50) NOT NULL,
    exam_name VARCHAR(200) NOT NULL,
    max_marks DECIMAL(5,2),
    passing_marks DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff
CREATE TABLE IF NOT EXISTS branch_1.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(200),
    phone VARCHAR(20),
    designation VARCHAR(100),
    role user_role NOT NULL,
    status status_type DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Students
CREATE TABLE IF NOT EXISTS branch_1.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    admission_date DATE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(200),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    class_id UUID REFERENCES branch_1.classes(id),
    section_id UUID REFERENCES branch_1.sections(id),
    roll_number VARCHAR(20),
    status status_type DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Student Attendance
CREATE TABLE IF NOT EXISTS branch_1.student_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES branch_1.students(id),
    date DATE NOT NULL,
    period_id UUID REFERENCES branch_1.attendance_periods(id),
    status attendance_status NOT NULL DEFAULT 'present',
    marked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, date, period_id)
);

-- Staff Attendance
CREATE TABLE IF NOT EXISTS branch_1.staff_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES branch_1.staff(id),
    date DATE NOT NULL,
    period_id UUID REFERENCES branch_1.attendance_periods(id),
    status attendance_status DEFAULT 'present',
    rfid_tap_in TIMESTAMPTZ,
    rfid_tap_out TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, date, period_id)
);

-- Fee Structure
CREATE TABLE IF NOT EXISTS branch_1.fee_structure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES branch_1.classes(id),
    fee_category_id UUID REFERENCES branch_1.fee_categories(id),
    academic_year VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, fee_category_id, academic_year)
);

-- Student Fees
CREATE TABLE IF NOT EXISTS branch_1.student_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES branch_1.students(id),
    fee_category_id UUID NOT NULL REFERENCES branch_1.fee_categories(id),
    academic_year VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    status payment_status DEFAULT 'pending',
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, fee_category_id, academic_year)
);

-- Fee Payments
CREATE TABLE IF NOT EXISTS branch_1.fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    student_id UUID NOT NULL REFERENCES branch_1.students(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    payment_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave Requests
CREATE TABLE IF NOT EXISTS branch_1.leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES branch_1.staff(id),
    leave_type_id UUID NOT NULL REFERENCES branch_1.leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(5,2) NOT NULL,
    reason TEXT,
    status approval_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exams
CREATE TABLE IF NOT EXISTS branch_1.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_name VARCHAR(200) NOT NULL,
    exam_type_id UUID REFERENCES branch_1.exam_types(id),
    class_id UUID REFERENCES branch_1.classes(id),
    start_date DATE,
    end_date DATE,
    academic_year VARCHAR(20),
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marks
CREATE TABLE IF NOT EXISTS branch_1.marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES branch_1.exams(id),
    student_id UUID NOT NULL REFERENCES branch_1.students(id),
    subject_id UUID REFERENCES branch_1.subjects(id),
    marks_obtained DECIMAL(5,2),
    max_marks DECIMAL(5,2),
    grade VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_id, student_id, subject_id)
);

-- STEP 5: Insert Seed Data

-- Super Admin (password: Admin@123)
INSERT INTO global.super_admins (email, username, password_hash, full_name, phone, is_active)
VALUES ('superadmin@school.edu', 'superadmin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.aO4.Vv7hMYKNm.', 'Super Administrator', '+91-9999999999', TRUE)
ON CONFLICT (username) DO NOTHING;

-- First Branch
INSERT INTO global.branches (branch_code, branch_name, schema_name, city, state, phone, email, max_students, max_staff)
VALUES ('BR001', 'Main Campus', 'branch_1', 'Mumbai', 'Maharashtra', '+91-22-12345678', 'main@school.edu', 15000, 500)
ON CONFLICT (branch_code) DO NOTHING;

-- Branch Settings
INSERT INTO branch_1.branch_settings (academic_year, grading_system, passing_percentage)
VALUES ('2024-25', 'marks', 35.00)
ON CONFLICT DO NOTHING;

-- Attendance Periods
INSERT INTO branch_1.attendance_periods (period_number, period_name, start_time, end_time, is_break) VALUES
(1, 'Period 1', '08:00', '08:45', false),
(2, 'Period 2', '08:50', '09:35', false),
(3, 'Period 3', '09:40', '10:25', false),
(4, 'Break', '10:25', '10:45', true),
(5, 'Period 4', '10:45', '11:30', false),
(6, 'Period 5', '11:35', '12:20', false),
(7, 'Lunch', '12:20', '13:00', true),
(8, 'Period 6', '13:00', '13:45', false)
ON CONFLICT DO NOTHING;

-- Fee Categories
INSERT INTO branch_1.fee_categories (category_name, category_code, is_mandatory, payment_cycle) VALUES
('Admission Fee', 'ADM_FEE', true, 'one_time'),
('Tuition Fee', 'TUI_FEE', true, 'quarterly'),
('Exam Fee', 'EXAM_FEE', true, 'quarterly'),
('Transport Fee', 'TRN_FEE', false, 'quarterly')
ON CONFLICT DO NOTHING;

-- Leave Types
INSERT INTO branch_1.leave_types (leave_type, leave_name, default_days) VALUES
('casual_leave', 'Casual Leave', 12),
('sick_leave', 'Sick Leave', 10),
('earned_leave', 'Earned Leave', 15)
ON CONFLICT DO NOTHING;

-- Exam Types
INSERT INTO branch_1.exam_types (exam_type, exam_name, max_marks, passing_marks) VALUES
('unit_test', 'Unit Test', 25, 9),
('mid_term', 'Mid-Term', 100, 35),
('final', 'Final Exam', 100, 35)
ON CONFLICT DO NOTHING;

-- Classes
INSERT INTO branch_1.classes (class_name, class_code, display_order) VALUES
('Nursery', 'NUR', 1),
('LKG', 'LKG', 2),
('UKG', 'UKG', 3),
('Class 1', 'C1', 4),
('Class 2', 'C2', 5),
('Class 3', 'C3', 6),
('Class 4', 'C4', 7),
('Class 5', 'C5', 8),
('Class 6', 'C6', 9),
('Class 7', 'C7', 10),
('Class 8', 'C8', 11),
('Class 9', 'C9', 12),
('Class 10', 'C10', 13)
ON CONFLICT DO NOTHING;

-- Sections (A, B, C for each class)
INSERT INTO branch_1.sections (class_id, section_name, capacity)
SELECT c.id, s.section_name, 40
FROM branch_1.classes c
CROSS JOIN (VALUES ('A'), ('B'), ('C')) AS s(section_name)
ON CONFLICT DO NOTHING;

-- Subjects
INSERT INTO branch_1.subjects (subject_name, subject_code) VALUES
('English', 'ENG'),
('Hindi', 'HIN'),
('Mathematics', 'MATH'),
('Science', 'SCI'),
('Social Science', 'SST')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
SELECT 'Database setup complete!' as status;
SELECT 'Branches: ' || COUNT(*) as info FROM global.branches;
SELECT 'Super Admins: ' || COUNT(*) as info FROM global.super_admins;
SELECT 'Classes: ' || COUNT(*) as info FROM branch_1.classes;
SELECT 'Sections: ' || COUNT(*) as info FROM branch_1.sections;
SELECT 'Subjects: ' || COUNT(*) as info FROM branch_1.subjects;
