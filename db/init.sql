-- School ERP Database Initialization
-- Run this first to set up extensions and custom types

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";  -- For GPS tracking in Transport module

-- ============================================================================
-- CUSTOM ENUMS (Global Types)
-- ============================================================================

-- User Roles
CREATE TYPE user_role AS ENUM (
    'super_admin',
    'admin',
    'director',
    'principal',
    'vp',
    'staff',
    'teacher',
    'parent',
    'student',
    'accountant',
    'librarian',
    'transport_manager',
    'warden',
    'mess_incharge',
    'lab_assistant',
    'front_office',
    'exam_dept'
);

-- Gender
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');

-- Status Types
CREATE TYPE status_type AS ENUM ('active', 'inactive', 'suspended', 'archived');
CREATE TYPE room_status AS ENUM ('active', 'maintenance', 'vacant');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'on_leave', 'half_day', 'late', 'early_exit');
CREATE TYPE payment_status AS ENUM ('pending', 'partial', 'paid', 'overdue', 'waived', 'refunded');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- Room Types
CREATE TYPE room_type AS ENUM (
    'classroom',
    'physics_lab',
    'chemistry_lab',
    'biology_lab',
    'computer_lab',
    'library',
    'principal_chamber',
    'vp_chamber',
    'teachers_chamber',
    'hod_office',
    'admin_office',
    'front_office',
    'accounts',
    'reception',
    'waiting_area',
    'auditorium',
    'sports_room',
    'medical_room',
    'store_room',
    'server_room',
    'cafeteria',
    'conference_room',
    'washroom',
    'parking_office',
    'transport_office'
);

-- Hostel Room Types
CREATE TYPE hostel_room_type AS ENUM ('single', 'double', 'triple', 'custom');

-- Leave Types
CREATE TYPE leave_type AS ENUM (
    'casual_leave',
    'sick_leave',
    'earned_leave',
    'unpaid_leave',
    'maternity_leave',
    'paternity_leave',
    'compensatory_off'
);

-- Exam Types
CREATE TYPE exam_type AS ENUM (
    'unit_test',
    'mid_term',
    'final',
    'class_test',
    'surprise_test',
    'practical',
    'internal_assessment'
);

-- Vehicle Types
CREATE TYPE vehicle_type AS ENUM ('own', 'rented');

-- Book Status
CREATE TYPE book_status AS ENUM ('available', 'issued', 'reserved', 'lost', 'damaged', 'maintenance');

-- Day of Week
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- Meal Type
CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'snacks', 'dinner');

-- Fee Payment Cycle
CREATE TYPE payment_cycle AS ENUM ('monthly', 'quarterly', 'half_yearly', 'yearly', 'one_time');

-- Transfer Options
CREATE TYPE transfer_due_option AS ENUM ('carry_forward', 'clear_and_admit', 'clear_at_origin');

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to generate roll numbers
CREATE OR REPLACE FUNCTION generate_roll_number()
RETURNS VARCHAR
AS $$
BEGIN
    RETURN 'ROLL' || to_char(NOW(), 'YYYY') || LPAD(nextval('roll_number_seq')::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Sequence for roll numbers
CREATE SEQUENCE IF NOT EXISTS roll_number_seq START 1;

-- Function to generate admission numbers
CREATE OR REPLACE FUNCTION generate_admission_number()
RETURNS VARCHAR
AS $$
BEGIN
    RETURN 'ADM' || to_char(NOW(), 'YYYY') || LPAD(nextval('admission_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Sequence for admission numbers
CREATE SEQUENCE IF NOT EXISTS admission_number_seq START 1;

-- Function to generate receipt numbers
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS VARCHAR
AS $$
BEGIN
    RETURN 'RCP' || to_char(NOW(), 'YYYYMM') || LPAD(nextval('receipt_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Sequence for receipt numbers
CREATE SEQUENCE IF NOT EXISTS receipt_number_seq START 1;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to soft delete
CREATE OR REPLACE FUNCTION soft_delete()
RETURNS TRIGGER
AS $$
BEGIN
    NEW.deleted_at = NOW();
    NEW.is_deleted = TRUE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
