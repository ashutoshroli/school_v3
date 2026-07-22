-- School ERP Database Initialization
-- Run this first to set up extensions and custom types

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUM Types
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'director', 'principal', 'vp', 'staff', 'teacher', 'parent', 'student', 'accountant');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE status_type AS ENUM ('active', 'inactive', 'suspended', 'archived');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'on_leave', 'late');
CREATE TYPE payment_status AS ENUM ('pending', 'partial', 'paid', 'overdue', 'waived');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE room_status AS ENUM ('active', 'maintenance', 'vacant');
CREATE TYPE leave_type AS ENUM ('casual_leave', 'sick_leave', 'earned_leave', 'unpaid_leave', 'maternity_leave', 'paternity_leave');
CREATE TYPE exam_type AS ENUM ('unit_test', 'mid_term', 'final', 'class_test', 'practical');
CREATE TYPE payment_cycle AS ENUM ('monthly', 'quarterly', 'half_yearly', 'yearly', 'one_time');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
CREATE TYPE room_type AS ENUM ('classroom', 'lab', 'library', 'office', 'auditorium', 'cafeteria', 'other');

-- Utility Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
