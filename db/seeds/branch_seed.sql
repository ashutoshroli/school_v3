-- Branch Template Seed Data
-- This seed data is applied to each new branch schema
-- Replace 'template' with actual schema name (e.g., 'branch_1')

-- ============================================================================
-- BRANCH SETTINGS
-- ============================================================================

INSERT INTO template.branch_settings (
    academic_year,
    academic_year_start_date,
    academic_year_end_date,
    working_days_per_year,
    week_start_day,
    grading_system,
    passing_percentage,
    default_payment_cycle,
    grace_period_days,
    staff_leave_quota,
    clash_detection_mode
) VALUES (
    '2024-25',
    '2024-04-01',
    '2025-03-31',
    220,
    'monday',
    'marks',
    35.00,
    'quarterly',
    3,
    '{"teacher": {"cl": 12, "sl": 10, "el": 15}, "staff": {"cl": 10, "sl": 8, "el": 12}, "principal": {"cl": 15, "sl": 12, "el": 20}}'::jsonb,
    'warning'
);

-- ============================================================================
-- ATTENDANCE PERIODS
-- ============================================================================

INSERT INTO template.attendance_periods (period_number, period_name, start_time, end_time, is_break) VALUES
(1, 'Period 1', '08:00', '08:45', false),
(2, 'Period 2', '08:50', '09:35', false),
(3, 'Period 3', '09:40', '10:25', false),
(4, 'Break', '10:25', '10:45', true),
(5, 'Period 4', '10:45', '11:30', false),
(6, 'Period 5', '11:35', '12:20', false),
(7, 'Lunch', '12:20', '13:00', true),
(8, 'Period 6', '13:00', '13:45', false),
(9, 'Period 7', '13:50', '14:35', false),
(10, 'Period 8', '14:40', '15:25', false);

-- ============================================================================
-- LEAVE TYPES
-- ============================================================================

INSERT INTO template.leave_types (leave_type, leave_name, default_days, allow_carry_forward, max_carry_forward_days, allow_lapse, allow_encash, applicable_roles, requires_document) VALUES
('casual_leave', 'Casual Leave', 12, true, 3, true, false, '["teacher", "staff", "admin"]'::jsonb, false),
('sick_leave', 'Sick Leave', 10, true, 5, true, false, '["teacher", "staff", "admin", "principal", "vp"]'::jsonb, true),
('earned_leave', 'Earned Leave', 15, true, 10, false, true, '["teacher", "staff", "admin", "principal", "vp"]'::jsonb, false),
('unpaid_leave', 'Unpaid Leave', 0, false, 0, false, false, '["teacher", "staff", "admin", "principal", "vp"]'::jsonb, false),
('maternity_leave', 'Maternity Leave', 180, false, 0, false, false, '["teacher", "staff"]'::jsonb, true),
('paternity_leave', 'Paternity Leave', 15, false, 0, false, false, '["teacher", "staff"]'::jsonb, false),
('compensatory_off', 'Compensatory Off', 0, true, 5, true, false, '["teacher", "staff", "admin"]'::jsonb, false);

-- ============================================================================
-- FEE CATEGORIES
-- ============================================================================

INSERT INTO template.fee_categories (category_name, category_code, is_mandatory, is_one_time, payment_cycle, late_fee_amount, late_fee_type) VALUES
('Admission Fee', 'ADM_FEE', true, true, 'one_time', 0, 'per_month'),
('Tuition Fee', 'TUI_FEE', true, false, 'quarterly', 500.00, 'per_month'),
('Exam Fee', 'EXAM_FEE', true, false, 'quarterly', 200.00, 'per_month'),
('Activity Fee', 'ACT_FEE', false, false, 'yearly', 0, 'per_month'),
('Transport Fee', 'TRN_FEE', false, false, 'quarterly', 100.00, 'per_month'),
('Hostel Fee', 'HOS_FEE', false, false, 'quarterly', 200.00, 'per_month'),
('Lab Fee', 'LAB_FEE', false, false, 'yearly', 0, 'per_month'),
('Library Fee', 'LIB_FEE', false, false, 'yearly', 0, 'per_month'),
('Sports Fee', 'SPO_FEE', false, false, 'yearly', 0, 'per_month'),
('Computer Fee', 'CMP_FEE', false, false, 'yearly', 0, 'per_month');

-- ============================================================================
-- EXAM TYPES
-- ============================================================================

INSERT INTO template.exam_types (exam_type, exam_name, weightage_percentage, max_marks, passing_marks) VALUES
('unit_test', 'Unit Test', 10.00, 25, 9),
('unit_test', 'Unit Test 2', 10.00, 25, 9),
('mid_term', 'Mid-Term Examination', 30.00, 100, 35),
('final', 'Final Examination', 50.00, 100, 35),
('class_test', 'Class Test', 0, 20, 7),
('practical', 'Practical Examination', 20.00, 50, 18);

-- ============================================================================
-- DEFAULT CLASSES
-- ============================================================================

INSERT INTO template.classes (class_name, class_code, display_order) VALUES
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
('Class 10', 'C10', 13),
('Class 11 - Science', 'C11S', 14),
('Class 11 - Commerce', 'C11C', 15),
('Class 12 - Science', 'C12S', 16),
('Class 12 - Commerce', 'C12C', 17);

-- ============================================================================
-- DEFAULT SECTIONS
-- ============================================================================

-- Create 5 sections per class (A, B, C, D, E)
INSERT INTO template.sections (class_id, section_name, capacity)
SELECT 
    c.id,
    s.section_name,
    40 as capacity
FROM template.classes c
CROSS JOIN (VALUES ('A'), ('B'), ('C'), ('D'), ('E')) AS s(section_name);

-- ============================================================================
-- DEFAULT SUBJECTS
-- ============================================================================

INSERT INTO template.subjects (subject_name, subject_code, is_practical, is_lab_based, department_id) VALUES
('English', 'ENG', false, false, null),
('Hindi', 'HIN', false, false, null),
('Mathematics', 'MATH', false, false, null),
('Science', 'SCI', false, false, null),
('Social Science', 'SST', false, false, null),
('Physics', 'PHY', false, true, null),
('Chemistry', 'CHEM', false, true, null),
('Biology', 'BIO', false, true, null),
('Computer Science', 'CS', false, true, null),
('Physical Education', 'PE', false, false, null),
('Art & Craft', 'ART', false, false, null),
('Music', 'MUS', false, false, null),
('General Knowledge', 'GK', false, false, null),
('Moral Science', 'MORAL', false, false, null);

-- ============================================================================
-- DEFAULT DEPARTMENTS
-- ============================================================================

INSERT INTO template.departments (department_name, department_code, description) VALUES
('Science Department', 'SCI_DEPT', 'Physics, Chemistry, Biology, Mathematics'),
('Languages Department', 'LANG_DEPT', 'English, Hindi, Sanskrit, French'),
('Social Science Department', 'SST_DEPT', 'History, Geography, Civics, Economics'),
('Computer Department', 'COMP_DEPT', 'Computer Science, IT'),
('Arts Department', 'ARTS_DEPT', 'Art, Music, Dance, Drama'),
('Sports Department', 'SPORT_DEPT', 'Physical Education, Sports'),
('Administration', 'ADMIN_DEPT', 'Administrative Staff'),
('Accounts', 'ACCT_DEPT', 'Finance and Accounts'),
('Library', 'LIB_DEPT', 'Library Staff'),
('Transport', 'TRN_DEPT', 'Transport Staff'),
('Hostel', 'HOS_DEPT', 'Hostel Staff');

-- ============================================================================
-- DEFAULT ROOM TYPES
-- ============================================================================

-- Sample Buildings
INSERT INTO template.buildings (building_code, building_name, total_floors, status) VALUES
('BLK_A', 'Academic Block A', 3, 'active'),
('BLK_B', 'Academic Block B', 3, 'active'),
('BLK_C', 'Admin Block', 2, 'active'),
('BLK_D', 'Lab Block', 2, 'active');

-- Sample Floors
INSERT INTO template.floors (building_id, floor_number, floor_name)
SELECT 
    b.id,
    f.floor_number,
    b.building_name || ' - Floor ' || f.floor_number
FROM template.buildings b
CROSS JOIN (VALUES (1), (2), (3)) AS f(floor_number)
WHERE f.floor_number <= b.total_floors;

-- Sample Rooms (Classrooms)
INSERT INTO template.rooms (room_code, room_name, room_type, building_id, floor_id, capacity, status)
SELECT 
    'CR-' || b.building_code || '-F' || f.floor_number || '-' || LPAD(r.room_num::text, 2, '0'),
    'Classroom ' || b.building_code || '-' || f.floor_number || '-' || LPAD(r.room_num::text, 2, '0'),
    'classroom',
    b.id,
    f.id,
    40,
    'active'
FROM template.buildings b
JOIN template.floors f ON f.building_id = b.id
CROSS JOIN (VALUES (1), (2), (3), (4), (5)) AS r(room_num)
WHERE b.building_code IN ('BLK_A', 'BLK_B');

-- Labs
INSERT INTO template.rooms (room_code, room_name, room_type, building_id, capacity, status)
SELECT 
    'LAB-' || lab_type,
    lab_name,
    lab_type::room_type,
    (SELECT id FROM template.buildings WHERE building_code = 'BLK_D'),
    30,
    'active'
FROM (VALUES 
    ('physics_lab', 'Physics Laboratory'),
    ('chemistry_lab', 'Chemistry Laboratory'),
    ('biology_lab', 'Biology Laboratory'),
    ('computer_lab', 'Computer Laboratory')
) AS labs(lab_type, lab_name);

-- Special Rooms
INSERT INTO template.rooms (room_code, room_name, room_type, capacity, status) VALUES
('PRINCIPAL', 'Principal''s Chamber', 'principal_chamber', 1, 'active'),
('VP', 'VP Chamber', 'vp_chamber', 1, 'active'),
('STAFF', 'Staff Room', 'teachers_chamber', 50, 'active'),
('LIB', 'Library', 'library', 100, 'active'),
('CONF', 'Conference Room', 'conference_room', 50, 'active'),
('AUDI', 'Auditorium', 'auditorium', 500, 'active'),
('SPORTS', 'Sports Room', 'sports_room', 30, 'active'),
('MEDICAL', 'Medical Room', 'medical_room', 10, 'active'),
('CAFETERIA', 'Cafeteria', 'cafeteria', 100, 'active'),
('RECEPTION', 'Reception', 'reception', 5, 'active');

-- ============================================================================
-- HOLIDAYS (Sample)
-- ============================================================================

INSERT INTO template.holidays (holiday_name, holiday_date, holiday_type, description, is_recurring) VALUES
('Summer Vacation Start', '2024-05-01', 'vacation', 'Summer Vacation Begins', false),
('Summer Vacation End', '2024-06-15', 'vacation', 'Summer Vacation Ends', false),
('Independence Day', '2024-08-15', 'national', 'Independence Day', true),
('Republic Day', '2025-01-26', 'national', 'Republic Day', true),
('Gandhi Jayanti', '2024-10-02', 'national', 'Gandhi Jayanti', true),
('Diwali', '2024-11-01', 'festival', 'Diwali Festival', false),
('Christmas', '2024-12-25', 'festival', 'Christmas Day', true),
('Holi', '2025-03-14', 'festival', 'Holi Festival', false);

-- ============================================================================
-- SCHOLARSHIPS (Sample)
-- ============================================================================

INSERT INTO template.scholarships (scholarship_name, description, criteria, discount_type, discount_value, is_active) VALUES
('Merit Scholarship', 'For students with excellent academic performance', '{"min_percentage": 90}', 'percentage', 25.00, true),
('Sports Scholarship', 'For students excelling in sports', '{"sports_level": "state"}', 'percentage', 20.00, true),
('Staff Ward', 'For children of staff members', '{"parent_employment": "staff"}', 'percentage', 50.00, true),
('Sibling Discount', 'Discount for siblings studying in same branch', '{"sibling_count": 2}', 'percentage', 10.00, true),
('EWS Scholarship', 'For Economically Weaker Sections', '{"income_limit": 100000}', 'percentage', 75.00, true);

-- ============================================================================
-- MESS MENU (Sample Week)
-- ============================================================================

INSERT INTO template.mess_menu (day_of_week, meal_type, menu_items, is_veg) VALUES
('monday', 'breakfast', '["Poha", "Tea", "Banana"]'::jsonb, true),
('monday', 'lunch', '["Rice", "Dal", "Sabzi", "Roti", "Salad"]'::jsonb, true),
('monday', 'snacks', '["Samosa", "Tea"]'::jsonb, true),
('monday', 'dinner', '["Rice", "Dal", "Sabzi", "Roti", "Papad"]'::jsonb, true),
('tuesday', 'breakfast', '["Upma", "Tea", "Apple"]'::jsonb, true),
('tuesday', 'lunch', '["Rice", "Dal", "Sabzi", "Roti", "Salad"]'::jsonb, true),
('tuesday', 'snacks', '["Biscuits", "Tea"]'::jsonb, true),
('tuesday', 'dinner', '["Rice", "Dal", "Sabzi", "Roti", "Papad"]'::jsonb, true);
-- Continue for other days...
