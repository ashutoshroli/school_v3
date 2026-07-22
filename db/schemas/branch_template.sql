-- Branch Template Schema for Multi-Branch School ERP
-- This schema is cloned for each new branch (branch_1, branch_2, etc.)
-- 
-- USAGE: Replace 'template' with actual schema name (e.g., 'branch_1')
--        sed 's/template/branch_1/g' branch_template.sql > branch_1_schema.sql

-- ============================================================================
-- CREATE SCHEMA
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS template;

-- ============================================================================
-- BRANCH SETTINGS
-- ============================================================================

CREATE TABLE template.branch_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Academic Configuration
    academic_year VARCHAR(20) NOT NULL,  -- e.g., '2024-25'
    academic_year_start_date DATE,
    academic_year_end_date DATE,
    working_days_per_year INTEGER DEFAULT 220,
    week_start_day day_of_week DEFAULT 'monday',
    custom_week JSONB DEFAULT '[]',  -- Custom week definition
    
    -- Grading System
    grading_system VARCHAR(20) DEFAULT 'marks',  -- marks, gpa, grade
    passing_percentage DECIMAL(5,2) DEFAULT 35.00,
    
    -- Fee Configuration
    default_payment_cycle payment_cycle DEFAULT 'quarterly',
    grace_period_days INTEGER DEFAULT 3,
    
    -- Leave Configuration
    staff_leave_quota JSONB DEFAULT '{}',  -- Role-wise leave quota
    
    -- Timetable Configuration
    clash_detection_mode VARCHAR(20) DEFAULT 'warning',  -- warning, block
    
    -- Branch-specific rules
    rules JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BUILDING & ROOM MANAGEMENT
-- ============================================================================

-- Buildings
CREATE TABLE template.buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_code VARCHAR(20) UNIQUE NOT NULL,
    building_name VARCHAR(200) NOT NULL,
    location_description TEXT,
    direction_from_main_gate TEXT,
    total_floors INTEGER DEFAULT 1,
    status room_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

-- Floors
CREATE TABLE template.floors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID NOT NULL REFERENCES template.buildings(id) ON DELETE CASCADE,
    floor_number INTEGER NOT NULL,
    floor_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(building_id, floor_number)
);

-- Rooms
CREATE TABLE template.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_code VARCHAR(20) UNIQUE NOT NULL,
    room_name VARCHAR(200),
    room_type room_type NOT NULL,
    building_id UUID REFERENCES template.buildings(id),
    floor_id UUID REFERENCES template.floors(id),
    direction_from_main_gate TEXT,
    capacity INTEGER DEFAULT 0,
    current_occupancy INTEGER DEFAULT 0,
    department VARCHAR(100),
    status room_status DEFAULT 'active',
    maintenance_notes TEXT,
    features JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);


-- Room Bookings (for shared rooms like Conference, Auditorium)
CREATE TABLE template.room_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES template.rooms(id),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    purpose TEXT,
    requested_by UUID,
    requested_role user_role,
    approval_status approval_status DEFAULT 'pending',
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    EXCLUDE USING GIST (
        room_id WITH =,
        booking_date WITH =,
        tsrange(start_time, end_time) WITH &&
    )
);

-- Cabins (for Teachers' Chamber)
CREATE TABLE template.cabins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES template.rooms(id),
    cabin_number VARCHAR(20) NOT NULL,
    assigned_to UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(room_id, cabin_number)
);

-- ============================================================================
-- DEPARTMENTS
-- ============================================================================

CREATE TABLE template.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_name VARCHAR(200) NOT NULL,
    department_code VARCHAR(20) UNIQUE,
    hod_id UUID,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CLASSES & SECTIONS
-- ============================================================================

-- Classes (e.g., Class 1, Class 2, etc.)
CREATE TABLE template.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_name VARCHAR(50) NOT NULL,
    class_code VARCHAR(20) UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0,
    class_teacher_id UUID,
    default_fee_category_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sections (e.g., Section A, Section B, etc.)
CREATE TABLE template.sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES template.classes(id) ON DELETE CASCADE,
    section_name VARCHAR(20) NOT NULL,
    capacity INTEGER DEFAULT 40,
    current_strength INTEGER DEFAULT 0,
    room_id UUID REFERENCES template.rooms(id),
    section_teacher_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, section_name)
);

-- Subjects
CREATE TABLE template.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_name VARCHAR(200) NOT NULL,
    subject_code VARCHAR(20) UNIQUE,
    is_practical BOOLEAN DEFAULT FALSE,
    is_lab_based BOOLEAN DEFAULT FALSE,
    lab_room_type room_type,
    department_id UUID REFERENCES template.departments(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Class-Subject Mapping
CREATE TABLE template.class_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES template.classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES template.subjects(id) ON DELETE CASCADE,
    periods_per_week INTEGER DEFAULT 0,
    teacher_id UUID,
    is_elective BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, subject_id)
);

-- ============================================================================
-- STAFF MANAGEMENT
-- ============================================================================

CREATE TABLE template.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    global_user_id UUID,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || COALESCE(last_name, '')) STORED,
    email VARCHAR(200),
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    date_of_birth DATE,
    gender gender_type,
    blood_group VARCHAR(5),
    aadhaar_number VARCHAR(20),
    pan_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    designation VARCHAR(100),
    department_id UUID REFERENCES template.departments(id),
    employment_type VARCHAR(20),
    joining_date DATE,
    resignation_date DATE,
    role user_role NOT NULL,
    qualifications JSONB DEFAULT '[]',
    experience_years INTEGER DEFAULT 0,
    documents JSONB DEFAULT '{}',
    status status_type DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    deleted_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Staff Documents
CREATE TABLE template.staff_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES template.staff(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(200),
    file_path VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STUDENT MANAGEMENT
-- ============================================================================

CREATE TABLE template.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    global_user_id UUID,
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    admission_date DATE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || COALESCE(last_name, '')) STORED,
    email VARCHAR(200),
    phone VARCHAR(20),
    date_of_birth DATE NOT NULL,
    gender gender_type,
    blood_group VARCHAR(5),
    aadhaar_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    class_id UUID REFERENCES template.classes(id),
    section_id UUID REFERENCES template.sections(id),
    roll_number VARCHAR(20),
    roll_number_assigned_date DATE,
    previous_school VARCHAR(200),
    previous_school_address TEXT,
    transfer_certificate_number VARCHAR(100),
    category VARCHAR(50),
    religion VARCHAR(50),
    nationality VARCHAR(50) DEFAULT 'Indian',
    mother_tongue VARCHAR(50),
    status status_type DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    deleted_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE
);


-- Student Documents
CREATE TABLE template.student_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES template.students(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(200),
    file_path VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parents/Guardians
CREATE TABLE template.parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    global_user_id UUID,
    father_name VARCHAR(200),
    father_occupation VARCHAR(100),
    father_phone VARCHAR(20),
    father_email VARCHAR(200),
    father_qualification VARCHAR(100),
    mother_name VARCHAR(200),
    mother_occupation VARCHAR(100),
    mother_phone VARCHAR(20),
    mother_email VARCHAR(200),
    mother_qualification VARCHAR(100),
    guardian_name VARCHAR(200),
    guardian_relation VARCHAR(50),
    guardian_phone VARCHAR(20),
    guardian_email VARCHAR(200),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    annual_income DECIMAL(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student-Parent Mapping
CREATE TABLE template.student_parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES template.students(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES template.parents(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, parent_id)
);

-- Siblings
CREATE TABLE template.siblings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id_1 UUID NOT NULL REFERENCES template.students(id) ON DELETE CASCADE,
    student_id_2 UUID NOT NULL REFERENCES template.students(id) ON DELETE CASCADE,
    relationship VARCHAR(20),
    discount_approved BOOLEAN DEFAULT FALSE,
    discount_percentage DECIMAL(5,2),
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id_1, student_id_2),
    CHECK (student_id_1 != student_id_2)
);

-- ============================================================================
-- ATTENDANCE
-- ============================================================================

-- Attendance Periods Configuration
CREATE TABLE template.attendance_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period_number INTEGER NOT NULL,
    period_name VARCHAR(50),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_break BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Attendance (Period-wise)
CREATE TABLE template.student_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES template.students(id),
    date DATE NOT NULL,
    period_id UUID REFERENCES template.attendance_periods(id),
    status attendance_status NOT NULL DEFAULT 'present',
    remarks TEXT,
    rfid_tap_in TIMESTAMPTZ,
    rfid_tap_out TIMESTAMPTZ,
    marked_by UUID,
    marked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, date, period_id)
);

CREATE INDEX idx_student_attendance_date ON template.student_attendance(date);
CREATE INDEX idx_student_attendance_student ON template.student_attendance(student_id);


-- Staff Attendance (Period-wise with RFID)
CREATE TABLE template.staff_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES template.staff(id),
    date DATE NOT NULL,
    period_id UUID REFERENCES template.attendance_periods(id),
    rfid_tap_in TIMESTAMPTZ,
    rfid_tap_out TIMESTAMPTZ,
    status attendance_status DEFAULT 'present',
    is_late BOOLEAN DEFAULT FALSE,
    is_early_exit BOOLEAN DEFAULT FALSE,
    late_early_count INTEGER DEFAULT 0,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, date, period_id)
);

CREATE INDEX idx_staff_attendance_date ON template.staff_attendance(date);
CREATE INDEX idx_staff_attendance_staff ON template.staff_attendance(staff_id);

-- Staff Attendance Summary (for salary calculation)
CREATE TABLE template.staff_attendance_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES template.staff(id),
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    total_periods INTEGER DEFAULT 0,
    present_periods INTEGER DEFAULT 0,
    absent_periods INTEGER DEFAULT 0,
    leave_periods INTEGER DEFAULT 0,
    late_early_deductions INTEGER DEFAULT 0,
    attendance_percentage DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, month, year)
);

-- ============================================================================
-- LEAVE MANAGEMENT
-- ============================================================================

-- Leave Types (Branch-wise)
CREATE TABLE template.leave_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leave_type leave_type NOT NULL,
    leave_name VARCHAR(100) NOT NULL,
    default_days INTEGER DEFAULT 0,
    allow_carry_forward BOOLEAN DEFAULT FALSE,
    max_carry_forward_days INTEGER DEFAULT 0,
    allow_lapse BOOLEAN DEFAULT TRUE,
    allow_encash BOOLEAN DEFAULT FALSE,
    applicable_roles JSONB DEFAULT '[]',
    requires_document BOOLEAN DEFAULT FALSE,
    document_types JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave Balance (Staff-wise)
CREATE TABLE template.leave_balance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES template.staff(id),
    leave_type_id UUID NOT NULL REFERENCES template.leave_types(id),
    year INTEGER NOT NULL,
    total_days INTEGER DEFAULT 0,
    used_days INTEGER DEFAULT 0,
    remaining_days INTEGER DEFAULT 0,
    carry_forward_days INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, leave_type_id, year)
);


-- Leave Requests
CREATE TABLE template.leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES template.staff(id),
    leave_type_id UUID NOT NULL REFERENCES template.leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(5,2) NOT NULL,
    reason TEXT,
    document_path VARCHAR(500),
    current_level INTEGER DEFAULT 1,
    level_1_approver_id UUID,
    level_1_status approval_status DEFAULT 'pending',
    level_1_comments TEXT,
    level_1_approved_at TIMESTAMPTZ,
    level_2_approver_id UUID,
    level_2_status approval_status DEFAULT 'pending',
    level_2_comments TEXT,
    level_2_approved_at TIMESTAMPTZ,
    status leave_status DEFAULT 'pending',
    substitute_assigned BOOLEAN DEFAULT FALSE,
    substitute_staff_id UUID REFERENCES template.staff(id),
    substitute_periods JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leave_requests_staff ON template.leave_requests(staff_id);
CREATE INDEX idx_leave_requests_status ON template.leave_requests(status);

-- ============================================================================
-- TIMETABLE
-- ============================================================================

-- Timetable Template
CREATE TABLE template.timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES template.classes(id),
    section_id UUID REFERENCES template.sections(id),
    day day_of_week NOT NULL,
    period_id UUID NOT NULL REFERENCES template.attendance_periods(id),
    subject_id UUID REFERENCES template.subjects(id),
    teacher_id UUID REFERENCES template.staff(id),
    room_id UUID REFERENCES template.rooms(id),
    academic_year VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, section_id, day, period_id, academic_year)
);

-- Substitute Assignments
CREATE TABLE template.substitute_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    period_id UUID NOT NULL REFERENCES template.attendance_periods(id),
    original_teacher_id UUID NOT NULL REFERENCES template.staff(id),
    substitute_teacher_id UUID NOT NULL REFERENCES template.staff(id),
    class_id UUID REFERENCES template.classes(id),
    section_id UUID REFERENCES template.sections(id),
    subject_id UUID REFERENCES template.subjects(id),
    reason TEXT,
    source VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

-- ============================================================================
-- EXAM MODULE
-- ============================================================================

-- Exam Types (Branch-wise)
CREATE TABLE template.exam_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_type exam_type NOT NULL,
    exam_name VARCHAR(200) NOT NULL,
    weightage_percentage DECIMAL(5,2) DEFAULT 0,
    max_marks DECIMAL(5,2),
    passing_marks DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exams
CREATE TABLE template.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_name VARCHAR(200) NOT NULL,
    exam_type_id UUID REFERENCES template.exam_types(id),
    class_id UUID REFERENCES template.classes(id),
    section_id UUID REFERENCES template.sections(id),
    scope VARCHAR(20) DEFAULT 'class',
    start_date DATE,
    end_date DATE,
    academic_year VARCHAR(20),
    status VARCHAR(20) DEFAULT 'draft',
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Exam Schedule (Subject-wise)
CREATE TABLE template.exam_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES template.exams(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES template.subjects(id),
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_marks DECIMAL(5,2) NOT NULL,
    passing_marks DECIMAL(5,2),
    room_id UUID REFERENCES template.rooms(id),
    question_paper_uploaded BOOLEAN DEFAULT FALSE,
    question_paper_path VARCHAR(500),
    question_paper_uploaded_by UUID,
    question_paper_uploaded_at TIMESTAMPTZ,
    is_postponed BOOLEAN DEFAULT FALSE,
    new_exam_date DATE,
    postponement_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exam Invigilators
CREATE TABLE template.exam_invigilators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_schedule_id UUID NOT NULL REFERENCES template.exam_schedule(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES template.staff(id),
    duty_type VARCHAR(20),
    room_id UUID REFERENCES template.rooms(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_schedule_id, staff_id)
);

-- Exam Seat Plan
CREATE TABLE template.exam_seat_plan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_schedule_id UUID NOT NULL REFERENCES template.exam_schedule(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES template.rooms(id),
    student_id UUID NOT NULL REFERENCES template.students(id),
    row_number INTEGER,
    column_number INTEGER,
    seat_number VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_schedule_id, student_id)
);

-- Exam Attendance
CREATE TABLE template.exam_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_schedule_id UUID NOT NULL REFERENCES template.exam_schedule(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES template.students(id),
    status attendance_status DEFAULT 'present',
    remarks TEXT,
    marked_by UUID,
    marked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_schedule_id, student_id)
);

-- Marks Entry
CREATE TABLE template.marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_schedule_id UUID NOT NULL REFERENCES template.exam_schedule(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES template.students(id),
    marks_obtained DECIMAL(5,2),
    max_marks DECIMAL(5,2),
    grade VARCHAR(10),
    is_absent BOOLEAN DEFAULT FALSE,
    entered_by UUID,
    entered_at TIMESTAMPTZ DEFAULT NOW(),
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    final_verified_by UUID,
    final_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_schedule_id, student_id)
);


-- Report Card Configuration
CREATE TABLE template.report_card_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES template.classes(id),
    exam_weightage JSONB DEFAULT '{}',
    grading_scale JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Report Cards
CREATE TABLE template.report_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES template.students(id),
    exam_id UUID NOT NULL REFERENCES template.exams(id),
    academic_year VARCHAR(20),
    total_marks DECIMAL(6,2),
    max_marks DECIMAL(6,2),
    percentage DECIMAL(5,2),
    grade VARCHAR(10),
    rank INTEGER,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    published_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, exam_id)
);

-- ============================================================================
-- HOMEWORK
-- ============================================================================

CREATE TABLE template.homework (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES template.classes(id),
    section_id UUID REFERENCES template.sections(id),
    subject_id UUID NOT NULL REFERENCES template.subjects(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    attachment_path VARCHAR(500),
    assigned_date DATE NOT NULL,
    due_date DATE NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homework Submissions
CREATE TABLE template.homework_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    homework_id UUID NOT NULL REFERENCES template.homework(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES template.students(id),
    submission_text TEXT,
    submission_file_path VARCHAR(500),
    submitted_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'pending',
    is_late BOOLEAN DEFAULT FALSE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    remarks TEXT,
    graded_by UUID,
    graded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(homework_id, student_id)
);

-- Recheck Requests
CREATE TABLE template.homework_recheck_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    homework_submission_id UUID NOT NULL REFERENCES template.homework_submissions(id) ON DELETE CASCADE,
    reason TEXT,
    current_level INTEGER DEFAULT 1,
    level_1_status approval_status DEFAULT 'pending',
    level_1_comments TEXT,
    level_1_by UUID,
    level_1_at TIMESTAMPTZ,
    level_2_status approval_status DEFAULT 'pending',
    level_2_comments TEXT,
    level_2_by UUID,
    level_2_at TIMESTAMPTZ,
    level_3_status approval_status DEFAULT 'pending',
    level_3_comments TEXT,
    level_3_by UUID,
    level_3_at TIMESTAMPTZ,
    final_status approval_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- FEE MANAGEMENT
-- ============================================================================

-- Fee Categories
CREATE TABLE template.fee_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) NOT NULL,
    category_code VARCHAR(20) UNIQUE,
    is_mandatory BOOLEAN DEFAULT TRUE,
    is_one_time BOOLEAN DEFAULT FALSE,
    payment_cycle payment_cycle DEFAULT 'quarterly',
    late_fee_amount DECIMAL(10,2) DEFAULT 0,
    late_fee_type VARCHAR(20) DEFAULT 'per_month',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fee Structure (Class-wise)
CREATE TABLE template.fee_structure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES template.classes(id),
    fee_category_id UUID NOT NULL REFERENCES template.fee_categories(id),
    academic_year VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, fee_category_id, academic_year)
);

-- Student Fee Assignment
CREATE TABLE template.student_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES template.students(id),
    fee_category_id UUID NOT NULL REFERENCES template.fee_categories(id),
    academic_year VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    pending_amount DECIMAL(10,2),
    late_fee_applied DECIMAL(10,2) DEFAULT 0,
    due_date DATE,
    status payment_status DEFAULT 'pending',
    waiver_amount DECIMAL(10,2) DEFAULT 0,
    waiver_approved_by UUID,
    waiver_approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, fee_category_id, academic_year)
);

-- Fee Payments
CREATE TABLE template.fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    student_id UUID NOT NULL REFERENCES template.students(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    payment_date DATE NOT NULL,
    transaction_id VARCHAR(200),
    bank_name VARCHAR(100),
    cheque_number VARCHAR(50),
    remarks TEXT,
    received_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fee Payment Details (breakdown)
CREATE TABLE template.fee_payment_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES template.fee_payments(id) ON DELETE CASCADE,
    student_fee_id UUID NOT NULL REFERENCES template.student_fees(id),
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Scholarships
CREATE TABLE template.scholarships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scholarship_name VARCHAR(200) NOT NULL,
    description TEXT,
    criteria JSONB DEFAULT '{}',
    discount_type VARCHAR(20) DEFAULT 'percentage',
    discount_value DECIMAL(10,2) NOT NULL,
    applicable_fee_categories JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Scholarships
CREATE TABLE template.student_scholarships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES template.students(id),
    scholarship_id UUID NOT NULL REFERENCES template.scholarships(id),
    academic_year VARCHAR(20) NOT NULL,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, scholarship_id, academic_year)
);

-- ============================================================================
-- ADMISSION
-- ============================================================================

-- Admission Enquiries
CREATE TABLE template.admission_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name VARCHAR(200) NOT NULL,
    date_of_birth DATE,
    gender gender_type,
    father_name VARCHAR(200),
    mother_name VARCHAR(200),
    phone VARCHAR(20),
    email VARCHAR(200),
    address TEXT,
    seeking_class_id UUID REFERENCES template.classes(id),
    source VARCHAR(50),
    branch_priority JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'new',
    next_follow_up DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admission Applications
CREATE TABLE template.admission_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enquiry_id UUID REFERENCES template.admission_enquiries(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    gender gender_type,
    father_name VARCHAR(200),
    father_phone VARCHAR(20),
    father_email VARCHAR(200),
    father_occupation VARCHAR(100),
    mother_name VARCHAR(200),
    mother_phone VARCHAR(20),
    mother_email VARCHAR(200),
    mother_occupation VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(200),
    address TEXT,
    seeking_class_id UUID REFERENCES template.classes(id),
    documents JSONB DEFAULT '{}',
    entrance_test_required BOOLEAN DEFAULT TRUE,
    entrance_test_date DATE,
    entrance_test_score DECIMAL(5,2),
    entrance_test_status VARCHAR(20),
    status VARCHAR(20) DEFAULT 'submitted',
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    branch_priority JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- PAYROLL / SALARY
-- ============================================================================

-- Salary Structure
CREATE TABLE template.salary_structure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES template.staff(id),
    basic_salary DECIMAL(12,2) NOT NULL,
    hra DECIMAL(12,2) DEFAULT 0,
    da DECIMAL(12,2) DEFAULT 0,
    transport_allowance DECIMAL(12,2) DEFAULT 0,
    other_allowances DECIMAL(12,2) DEFAULT 0,
    pf DECIMAL(12,2) DEFAULT 0,
    esi DECIMAL(12,2) DEFAULT 0,
    professional_tax DECIMAL(12,2) DEFAULT 0,
    other_deductions DECIMAL(12,2) DEFAULT 0,
    gross_salary DECIMAL(12,2),
    net_salary DECIMAL(12,2),
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

-- Staff Ratings
CREATE TABLE template.staff_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES template.staff(id),
    rating_type VARCHAR(20) NOT NULL,
    rated_by_id UUID,
    rated_by_type VARCHAR(20),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    period VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Salary Payments
CREATE TABLE template.salary_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES template.staff(id),
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    basic DECIMAL(12,2),
    hra DECIMAL(12,2),
    da DECIMAL(12,2),
    transport_allowance DECIMAL(12,2),
    other_allowances DECIMAL(12,2),
    gross DECIMAL(12,2),
    pf DECIMAL(12,2),
    esi DECIMAL(12,2),
    professional_tax DECIMAL(12,2),
    other_deductions DECIMAL(12,2),
    net DECIMAL(12,2),
    attendance_percentage DECIMAL(5,2),
    working_days INTEGER,
    present_days INTEGER,
    status VARCHAR(20) DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, month, year)
);

-- Salary Increments
CREATE TABLE template.salary_increments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES template.staff(id),
    increment_percentage DECIMAL(5,2),
    increment_amount DECIMAL(12,2),
    previous_salary DECIMAL(12,2),
    new_salary DECIMAL(12,2),
    effective_from DATE NOT NULL,
    remarks TEXT,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TRANSPORT MODULE
-- ============================================================================

-- Vehicles
CREATE TABLE template.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    vehicle_name VARCHAR(100),
    capacity INTEGER DEFAULT 50,
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    gps_device_id VARCHAR(100),
    status status_type DEFAULT 'active',
    rented_per_km_rate DECIMAL(8,2),
    rented_monthly_fixed DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Routes
CREATE TABLE template.routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_name VARCHAR(100) NOT NULL,
    route_code VARCHAR(20) UNIQUE,
    distance_km DECIMAL(8,2),
    stops JSONB DEFAULT '[]',
    vehicle_id UUID REFERENCES template.vehicles(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Route Stops
CREATE TABLE template.route_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES template.routes(id) ON DELETE CASCADE,
    stop_name VARCHAR(100) NOT NULL,
    stop_order INTEGER NOT NULL,
    distance_from_school DECIMAL(8,2),
    pickup_time TIME,
    drop_time TIME,
    fee_amount DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(route_id, stop_order)
);

-- Student Transport Assignment
CREATE TABLE template.student_transport (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES template.students(id),
    route_id UUID NOT NULL REFERENCES template.routes(id),
    stop_id UUID REFERENCES template.route_stops(id),
    academic_year VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, academic_year)
);

-- Vehicle Attendance (RFID)
CREATE TABLE template.vehicle_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES template.vehicles(id),
    student_id UUID NOT NULL REFERENCES template.students(id),
    trip_date DATE NOT NULL,
    trip_type VARCHAR(20) NOT NULL,
    boarding_stop_id UUID REFERENCES template.route_stops(id),
    alighting_stop_id UUID REFERENCES template.route_stops(id),
    boarding_time TIMESTAMPTZ,
    alighting_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Diesel Requests
CREATE TABLE template.diesel_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES template.vehicles(id),
    requested_litres DECIMAL(8,2),
    requested_amount DECIMAL(10,2),
    reason TEXT,
    requested_by UUID,
    status approval_status DEFAULT 'pending',
    transport_manager_approved_by UUID,
    transport_manager_approved_at TIMESTAMPTZ,
    accounts_processed_by UUID,
    accounts_processed_at TIMESTAMPTZ,
    director_approved_by UUID,
    director_approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    re_request_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fuel Logs
CREATE TABLE template.fuel_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES template.vehicles(id),
    fuel_type VARCHAR(20) DEFAULT 'diesel',
    litres DECIMAL(8,2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    odometer_reading INTEGER,
    filled_at TIMESTAMPTZ DEFAULT NOW(),
    filled_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Vehicle Maintenance
CREATE TABLE template.vehicle_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES template.vehicles(id),
    maintenance_type VARCHAR(50) NOT NULL,
    description TEXT,
    cost DECIMAL(10,2),
    maintenance_date DATE NOT NULL,
    next_due_date DATE,
    garage_name VARCHAR(200),
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LIBRARY MODULE
-- ============================================================================

-- Books
CREATE TABLE template.books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    isbn VARCHAR(20),
    title VARCHAR(300) NOT NULL,
    author VARCHAR(200),
    publisher VARCHAR(200),
    publication_year INTEGER,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    purchase_rate DECIMAL(10,2),
    current_rate DECIMAL(10,2),
    rack_number VARCHAR(20),
    shelf_number VARCHAR(20),
    total_copies INTEGER DEFAULT 1,
    available_copies INTEGER DEFAULT 1,
    status book_status DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Book Issues
CREATE TABLE template.book_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES template.books(id),
    issued_to_id UUID NOT NULL,
    issued_to_type VARCHAR(20) NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(20) DEFAULT 'issued',
    fine_amount DECIMAL(10,2) DEFAULT 0,
    fine_paid BOOLEAN DEFAULT FALSE,
    damaged_lost_status VARCHAR(20),
    damage_lost_cost DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Library Fines
CREATE TABLE template.library_fines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_issue_id UUID NOT NULL REFERENCES template.book_issues(id),
    user_id UUID NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    fine_type VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status payment_status DEFAULT 'pending',
    waived_by UUID,
    waived_amount DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- HOSTEL MODULE
-- ============================================================================

-- Hostel Buildings
CREATE TABLE template.hostel_buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_name VARCHAR(200) NOT NULL,
    building_code VARCHAR(20) UNIQUE,
    building_type VARCHAR(20) DEFAULT 'boys',
    total_rooms INTEGER DEFAULT 0,
    total_beds INTEGER DEFAULT 0,
    warden_id UUID REFERENCES template.staff(id),
    status room_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Hostel Rooms
CREATE TABLE template.hostel_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostel_building_id UUID NOT NULL REFERENCES template.hostel_buildings(id),
    room_number VARCHAR(20) NOT NULL,
    room_type hostel_room_type DEFAULT 'double',
    total_beds INTEGER DEFAULT 2,
    occupied_beds INTEGER DEFAULT 0,
    floor_number INTEGER DEFAULT 1,
    monthly_rent DECIMAL(10,2),
    status room_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(hostel_building_id, room_number)
);

-- Hostel Beds
CREATE TABLE template.hostel_beds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostel_room_id UUID NOT NULL REFERENCES template.hostel_rooms(id),
    bed_number VARCHAR(10) NOT NULL,
    student_id UUID REFERENCES template.students(id),
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(hostel_room_id, bed_number)
);

-- Hostel Allotment Requests
CREATE TABLE template.hostel_allotment_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES template.students(id),
    preferred_room_type hostel_room_type,
    preferred_room_id UUID REFERENCES template.hostel_rooms(id),
    status approval_status DEFAULT 'pending',
    roommate_approval_required BOOLEAN DEFAULT FALSE,
    roommate_approved BOOLEAN,
    roommate_approved_at TIMESTAMPTZ,
    warden_approved_by UUID,
    warden_approved_at TIMESTAMPTZ,
    allotted_room_id UUID REFERENCES template.hostel_rooms(id),
    allotted_bed_id UUID REFERENCES template.hostel_beds(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hostel Attendance (RFID)
CREATE TABLE template.hostel_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES template.students(id),
    date DATE NOT NULL,
    rfid_tap_in TIMESTAMPTZ,
    rfid_tap_out TIMESTAMPTZ,
    is_present BOOLEAN DEFAULT FALSE,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- ============================================================================
-- MESS MODULE
-- ============================================================================

-- Mess Menu
CREATE TABLE template.mess_menu (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week day_of_week NOT NULL,
    meal_type meal_type NOT NULL,
    menu_items JSONB DEFAULT '[]',
    is_veg BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(day_of_week, meal_type)
);

-- Mess Billing
CREATE TABLE template.mess_billing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES template.students(id),
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    total_days INTEGER DEFAULT 30,
    billed_days INTEGER DEFAULT 30,
    amount DECIMAL(10,2) NOT NULL,
    waiver_days INTEGER DEFAULT 0,
    waiver_amount DECIMAL(10,2) DEFAULT 0,
    waiver_approved_by UUID,
    waiver_approved_at TIMESTAMPTZ,
    status payment_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, month, year)
);

-- Guest Meals
CREATE TABLE template.guest_meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_name VARCHAR(200) NOT NULL,
    guest_type VARCHAR(20) NOT NULL,
    hosted_by_student_id UUID REFERENCES template.students(id),
    meal_date DATE NOT NULL,
    meal_type meal_type NOT NULL,
    amount DECIMAL(10,2),
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Approval
CREATE TABLE template.menu_approval_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_week DATE NOT NULL,
    proposed_menu JSONB NOT NULL,
    created_by UUID,
    current_level INTEGER DEFAULT 1,
    mess_incharge_status approval_status DEFAULT 'pending',
    warden_status approval_status DEFAULT 'pending',
    principal_status approval_status DEFAULT 'pending',
    director_status approval_status DEFAULT 'pending',
    final_status approval_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- CANTEEN MODULE
-- ============================================================================

-- Canteen Counters
CREATE TABLE template.canteen_counters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    counter_name VARCHAR(100) NOT NULL,
    counter_code VARCHAR(20) UNIQUE,
    incharge_id UUID REFERENCES template.staff(id),
    status status_type DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Canteen Items
CREATE TABLE template.canteen_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(200) NOT NULL,
    item_code VARCHAR(20) UNIQUE,
    category VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Canteen Inventory
CREATE TABLE template.canteen_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    unit VARCHAR(20),
    current_stock DECIMAL(10,2) DEFAULT 0,
    min_stock DECIMAL(10,2) DEFAULT 0,
    rack_location VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Canteen Stock Transactions
CREATE TABLE template.canteen_stock_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id UUID NOT NULL REFERENCES template.canteen_inventory(id),
    transaction_type VARCHAR(20) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    reference_id UUID,
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Canteen Wallet (for students/staff)
CREATE TABLE template.canteen_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, user_type)
);

-- Wallet Transactions
CREATE TABLE template.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES template.canteen_wallets(id),
    transaction_type VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2),
    reference_id VARCHAR(100),
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Canteen Orders
CREATE TABLE template.canteen_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    counter_id UUID REFERENCES template.canteen_counters(id),
    user_id UUID,
    user_type VARCHAR(20),
    order_type VARCHAR(20) NOT NULL,
    items JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20),
    payment_status payment_status DEFAULT 'pending',
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock Replenish Requests
CREATE TABLE template.canteen_replenish_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES template.canteen_inventory(id),
    quantity DECIMAL(10,2) NOT NULL,
    estimated_cost DECIMAL(10,2),
    requested_by UUID,
    status approval_status DEFAULT 'pending',
    incharge_approved_by UUID,
    manager_approved_by UUID,
    accounts_processed_by UUID,
    director_approved_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appliances
CREATE TABLE template.canteen_appliances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appliance_name VARCHAR(200) NOT NULL,
    appliance_type VARCHAR(100),
    purchase_date DATE,
    warranty_end_date DATE,
    amc_end_date DATE,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- LAB MANAGEMENT MODULE
-- ============================================================================

-- Lab Equipment
CREATE TABLE template.lab_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_name VARCHAR(200) NOT NULL,
    equipment_code VARCHAR(20) UNIQUE,
    lab_type room_type NOT NULL,
    quantity INTEGER DEFAULT 1,
    available_quantity INTEGER DEFAULT 1,
    purchase_date DATE,
    condition_status VARCHAR(20) DEFAULT 'good',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lab Equipment Issue
CREATE TABLE template.lab_equipment_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL REFERENCES template.lab_equipment(id),
    issue_type VARCHAR(20) NOT NULL,
    issued_to_type VARCHAR(20) NOT NULL,
    issued_to_ids JSONB NOT NULL,
    issued_by UUID NOT NULL,
    issue_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(20) DEFAULT 'issued',
    condition_on_return VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lab Equipment Damage/Breakage
CREATE TABLE template.lab_equipment_damage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL REFERENCES template.lab_equipment(id),
    equipment_issue_id UUID REFERENCES template.lab_equipment_issues(id),
    damage_type VARCHAR(20) NOT NULL,
    damage_description TEXT,
    fine_amount DECIMAL(10,2),
    fine_paid BOOLEAN DEFAULT FALSE,
    fine_waived BOOLEAN DEFAULT FALSE,
    waived_by UUID,
    waived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lab Consumables
CREATE TABLE template.lab_consumables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(200) NOT NULL,
    lab_type room_type NOT NULL,
    quantity INTEGER DEFAULT 0,
    unit VARCHAR(20),
    expiry_date DATE,
    min_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INVENTORY MODULE (School-wide)
-- ============================================================================

-- Inventory Categories
CREATE TABLE template.inventory_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) NOT NULL,
    category_code VARCHAR(20) UNIQUE,
    parent_category_id UUID REFERENCES template.inventory_categories(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Items
CREATE TABLE template.inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(200) NOT NULL,
    item_code VARCHAR(20) UNIQUE,
    category_id UUID REFERENCES template.inventory_categories(id),
    unit VARCHAR(20),
    current_stock DECIMAL(10,2) DEFAULT 0,
    min_stock DECIMAL(10,2) DEFAULT 0,
    location VARCHAR(100),
    status status_type DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Transactions
CREATE TABLE template.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES template.inventory_items(id),
    transaction_type VARCHAR(20) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    reference_id UUID,
    reference_type VARCHAR(50),
    department VARCHAR(100),
    issued_to UUID,
    issued_to_type VARCHAR(20),
    return_status VARCHAR(20),
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Requests
CREATE TABLE template.purchase_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_type VARCHAR(50) NOT NULL,
    items JSONB NOT NULL,
    estimated_cost DECIMAL(12,2),
    requested_by UUID,
    justification TEXT,
    status approval_status DEFAULT 'pending',
    incharge_approved_by UUID,
    manager_approved_by UUID,
    accounts_processed_by UUID,
    director_approved_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Inventory Damage/Loss
CREATE TABLE template.inventory_damage_loss (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES template.inventory_items(id),
    damage_loss_type VARCHAR(20) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    description TEXT,
    fine_amount DECIMAL(10,2),
    fine_paid BOOLEAN DEFAULT FALSE,
    fine_waived BOOLEAN DEFAULT FALSE,
    waived_by UUID,
    waived_at TIMESTAMPTZ,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- HOLIDAYS & EVENTS
-- ============================================================================

CREATE TABLE template.holidays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    holiday_name VARCHAR(200) NOT NULL,
    holiday_date DATE NOT NULL,
    holiday_type VARCHAR(20) NOT NULL,
    description TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE template.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(200) NOT NULL,
    event_description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    venue UUID REFERENCES template.rooms(id),
    organizer UUID,
    is_public BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS (Branch-level)
-- ============================================================================

CREATE TABLE template.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    message TEXT,
    notification_type VARCHAR(50),
    target_roles JSONB DEFAULT '[]',
    target_users JSONB DEFAULT '[]',
    is_public BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Notification Status
CREATE TABLE template.user_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id UUID NOT NULL REFERENCES template.notifications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(notification_id, user_id)
);

-- ============================================================================
-- RFID CARDS
-- ============================================================================

CREATE TABLE template.rfid_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_number VARCHAR(50) UNIQUE NOT NULL,
    assigned_to_id UUID NOT NULL,
    assigned_to_type VARCHAR(20) NOT NULL,
    issue_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PUBLIC LANDING PAGE CONTENT
-- ============================================================================

CREATE TABLE template.landing_page_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_name VARCHAR(100) NOT NULL,
    content JSONB NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    published_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE template.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_path VARCHAR(500) NOT NULL,
    category VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FEEDBACK
-- ============================================================================

CREATE TABLE template.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feedback_type VARCHAR(50) NOT NULL,
    name VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new',
    responded_by UUID,
    responded_at TIMESTAMPTZ,
    response TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BRANCH AUDIT LOG
-- ============================================================================

CREATE TABLE template.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_role user_role,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON template.audit_log(user_id);
CREATE INDEX idx_audit_log_action ON template.audit_log(action);
CREATE INDEX idx_audit_log_entity ON template.audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON template.audit_log(created_at);

-- ============================================================================
-- SCHEMA VERSION TRACKING
-- ============================================================================

CREATE TABLE template.schema_version (
    id SERIAL PRIMARY KEY,
    version VARCHAR(20) NOT NULL,
    description TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO template.schema_version (version, description) VALUES
('1.0.0', 'Initial branch template schema');
