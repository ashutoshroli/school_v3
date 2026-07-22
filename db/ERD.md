# Entity Relationship Diagram (ERD)

## Global Schema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              GLOBAL SCHEMA                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────┐         ┌─────────────────┐                            │
│  │    branches     │         │  super_admins   │                            │
│  ├─────────────────┤         ├─────────────────┤                            │
│  │ id (PK)         │         │ id (PK)         │                            │
│  │ branch_code     │         │ email           │                            │
│  │ branch_name     │         │ username        │                            │
│  │ schema_name     │         │ password_hash   │                            │
│  │ address         │         │ full_name       │                            │
│  │ city            │         │ is_active       │                            │
│  │ state           │         │ bypass_all_...  │                            │
│  │ max_students    │         └─────────────────┘                            │
│  │ max_staff       │                                                          │
│  │ status          │         ┌─────────────────┐                            │
│  └────────┬────────┘         │     users       │                            │
│           │                  ├─────────────────┤                            │
│           │                  │ id (PK)         │                            │
│           │                  │ email           │                            │
│           │                  │ username        │                            │
│           │                  │ user_role       │                            │
│           │                  │ primary_..._id  │──┐                          │
│           │                  └────────┬────────┘  │                          │
│           │                           │           │                          │
│           └───────────────────────────┼───────────┘                          │
│                                       │                                      │
│  ┌────────────────────────────────────────────────────────┐                 │
│  │              user_branch_access                         │                 │
│  ├────────────────────────────────────────────────────────┤                 │
│  │ user_id (FK) ────────────────────> users.id            │                 │
│  │ branch_id (FK) ─────────────────> branches.id          │                 │
│  │ role_in_branch                                          │                 │
│  └────────────────────────────────────────────────────────┘                 │
│                                                                               │
│  ┌────────────────────────────────────────────────────────┐                 │
│  │              branch_transfers                           │                 │
│  ├────────────────────────────────────────────────────────┤                 │
│  │ id (PK)                                                 │                 │
│  │ from_branch_id (FK) ──────────────> branches.id        │                 │
│  │ to_branch_id (FK) ────────────────> branches.id        │                 │
│  │ requested_by (FK) ─────────────────> users.id          │                 │
│  │ transfer_type (student/staff)                          │                 │
│  │ approval_status                                         │                 │
│  └────────────────────────────────────────────────────────┘                 │
│                                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ configurations  │  │ sessions        │  │ audit_logs      │             │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤             │
│  │ key (PK)        │  │ user_id (FK)    │  │ user_id (FK)    │             │
│  │ value           │  │ token_hash      │  │ action          │             │
│  │ is_public       │  │ is_active       │  │ entity_type     │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Branch Schema (template / branch_1 / branch_2 / branch_3)

### Core Entities

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BRANCH SCHEMA - CORE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────┐         ┌─────────────────┐                            │
│  │ branch_settings │         │   buildings     │                            │
│  ├─────────────────┤         ├─────────────────┤                            │
│  │ academic_year   │         │ id (PK)         │                            │
│  │ working_days    │         │ building_code   │                            │
│  │ grading_system  │         │ building_name   │                            │
│  │ grace_period    │         │ total_floors    │                            │
│  └─────────────────┘         │ status          │                            │
│                              └────────┬────────┘                            │
│                                       │                                      │
│                              ┌────────▼────────┐                            │
│                              │     floors      │                            │
│                              ├─────────────────┤                            │
│                              │ id (PK)         │                            │
│                              │ building_id(FK) │──┐                          │
│                              │ floor_number    │  │                          │
│                              └─────────────────┘  │                          │
│                                                   │                          │
│  ┌─────────────────┐         ┌─────────────────┐  │                          │
│  │     rooms       │         │    cabins       │  │                          │
│  ├─────────────────┤         ├─────────────────┤  │                          │
│  │ id (PK)         │◄────────│ room_id (FK)    │  │                          │
│  │ room_code       │         │ cabin_number    │  │                          │
│  │ room_type       │         │ assigned_to     │  │                          │
│  │ building_id(FK) │─────────┼─────────────────┼──┘                          │
│  │ floor_id (FK)   │         │                 │                             │
│  │ capacity        │         └─────────────────┘                             │
│  │ status          │                                                         │
│  └────────┬────────┘                                                         │
│           │                                                                  │
│           │         ┌─────────────────┐                                     │
│           └────────►│  room_bookings  │                                     │
│                     ├─────────────────┤                                     │
│                     │ room_id (FK)    │                                     │
│                     │ booking_date    │                                     │
│                     │ start_time      │                                     │
│                     │ approval_status │                                     │
│                     └─────────────────┘                                     │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Academic Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BRANCH SCHEMA - ACADEMIC                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────┐         ┌─────────────────┐                            │
│  │   departments   │         │     classes     │                            │
│  ├─────────────────┤         ├─────────────────┤                            │
│  │ id (PK)         │         │ id (PK)         │                            │
│  │ department_name │         │ class_name      │                            │
│  │ department_code │         │ class_code      │                            │
│  │ hod_id (FK)     │──┐      │ display_order   │                            │
│  └────────┬────────┘  │      └────────┬────────┘                            │
│           │           │               │                                      │
│           │           │      ┌────────▼────────┐                            │
│           │           │      │    sections     │                            │
│           │           │      ├─────────────────┤                            │
│           │           │      │ id (PK)         │                            │
│           │           │      │ class_id (FK)   │──┐                          │
│           │           │      │ section_name    │  │                          │
│           │           │      │ capacity        │  │                          │
│           │           │      │ room_id (FK)    │  │                          │
│           │           │      └─────────────────┘  │                          │
│           │           │                           │                          │
│  ┌────────▼────────┐  │                           │                          │
│  │    subjects     │  │                           │                          │
│  ├─────────────────┤  │                           │                          │
│  │ id (PK)         │  │                           │                          │
│  │ subject_name    │  │                           │                          │
│  │ subject_code    │  │                           │                          │
│  │ is_lab_based    │  │                           │                          │
│  │ department_id(FK│──┘                           │                          │
│  └────────┬────────┘                              │                          │
│           │                                       │                          │
│  ┌────────▼────────────────────────────────────────┘                          │
│  │              class_subjects                                                │
│  ├────────────────────────────────────────────────────────────────────────┤  │
│  │ class_id (FK) ────────────────────────> classes.id                      │  │
│  │ subject_id (FK) ─────────────────────> subjects.id                      │  │
│  │ teacher_id (FK) ─────────────────────> staff.id                         │  │
│  │ periods_per_week                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Student & Staff Management

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     BRANCH SCHEMA - PEOPLE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────┐                      ┌─────────────────┐               │
│  │     staff       │                      │    students     │               │
│  ├─────────────────┤                      ├─────────────────┤               │
│  │ id (PK)         │                      │ id (PK)         │               │
│  │ global_user_id  │                      │ global_user_id  │               │
│  │ employee_id     │                      │ admission_number│               │
│  │ first_name      │                      │ first_name      │               │
│  │ last_name       │                      │ last_name       │               │
│  │ email           │                      │ class_id (FK)   │──┐            │
│  │ phone           │                      │ section_id (FK) │  │            │
│  │ department_id(FK│                      │ roll_number     │  │            │
│  │ role            │                      │ status          │  │            │
│  │ status          │                      └────────┬────────┘  │            │
│  └────────┬────────┘                               │           │            │
│           │                                        │           │            │
│           │            ┌───────────────────────────┘           │            │
│           │            │                                       │            │
│           │            │         ┌─────────────────┐           │            │
│           │            │         │     parents     │           │            │
│           │            │         ├─────────────────┤           │            │
│           │            │         │ id (PK)         │           │            │
│           │            │         │ father_name     │           │            │
│           │            │         │ father_phone    │           │            │
│           │            │         │ mother_name     │           │            │
│           │            │         │ mother_phone    │           │            │
│           │            │         └────────┬────────┘           │            │
│           │            │                  │                    │            │
│           │            │   ┌──────────────▼──────────────┐     │            │
│           │            │   │     student_parents         │     │            │
│           │            │   ├─────────────────────────────┤     │            │
│           │            │   │ student_id (FK) ────────────┼─────┘            │
│           │            │   │ parent_id (FK)              │                  │
│           │            │   │ is_primary                  │                  │
│           │            │   └─────────────────────────────┘                  │
│           │            │                                                    │
│           │            │   ┌─────────────────────────────┐                  │
│           │            │   │       siblings              │                  │
│           │            │   ├─────────────────────────────┤                  │
│           │            │   │ student_id_1 (FK)           │                  │
│           │            │   │ student_id_2 (FK)           │                  │
│           │            │   │ discount_approved           │                  │
│           │            │   └─────────────────────────────┘                  │
│           │            │                                                    │
│           │            └────────────────────────────────────────────────────┘
│           │                                                                  │
│           └───────────────────────────────────────────────────────┐          │
│                                                                     │          │
│  ┌──────────────────────────────────────────────────────────────────▼─────┐  │
│  │                     student_documents / staff_documents                 │  │
│  ├────────────────────────────────────────────────────────────────────────┤  │
│  │ student_id (FK) / staff_id (FK)                                        │  │
│  │ document_type, document_name, file_path                                │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Attendance & Leave

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BRANCH SCHEMA - ATTENDANCE & LEAVE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     attendance_periods                               │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │ period_number, period_name, start_time, end_time, is_break          │    │
│  └────────────────────────────────┬────────────────────────────────────┘    │
│                                   │                                          │
│  ┌────────────────────────────────▼────────────────────────────────────┐    │
│  │                       student_attendance                             │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │ student_id (FK) ──────> students.id                                  │    │
│  │ date, period_id (FK)                                                 │    │
│  │ status, rfid_tap_in, rfid_tap_out                                   │    │
│  │ marked_by (FK) ───────> staff.id                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                       staff_attendance                               │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │ staff_id (FK) ────────> staff.id                                     │    │
│  │ date, period_id (FK)                                                 │    │
│  │ rfid_tap_in, rfid_tap_out                                           │    │
│  │ is_late, is_early_exit, late_early_count                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│  ┌─────────────────┐         ┌─────────────────┐                            │
│  │   leave_types   │         │  leave_balance  │                            │
│  ├─────────────────┤         ├─────────────────┤                            │
│  │ id (PK)         │◄────────│ leave_type_id(FK)│                           │
│  │ leave_type      │         │ staff_id (FK)   │                            │
│  │ default_days    │         │ year            │                            │
│  │ allow_carry_... │         │ total_days      │                            │
│  │ applicable_roles│         │ used_days       │                            │
│  └────────┬────────┘         └─────────────────┘                            │
│           │                                                                  │
│  ┌────────▼─────────────────────────────────────────────────────────────┐   │
│  │                       leave_requests                                  │   │
│  ├───────────────────────────────────────────────────────────────────────┤  │
│  │ staff_id (FK) ─────────────────> staff.id                             │   │
│  │ leave_type_id (FK) ────────────> leave_types.id                       │   │
│  │ start_date, end_date, total_days                                      │   │
│  │ level_1_status, level_2_status (2-level approval)                    │   │
│  │ substitute_staff_id (FK) ──────> staff.id                             │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Exam & Timetable

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BRANCH SCHEMA - EXAM & TIMETABLE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────┐         ┌─────────────────┐                            │
│  │   exam_types    │         │      exams      │                            │
│  ├─────────────────┤         ├─────────────────┤                            │
│  │ id (PK)         │◄────────│ exam_type_id(FK)│                            │
│  │ exam_type       │         │ class_id (FK)   │                            │
│  │ exam_name       │         │ start_date      │                            │
│  │ weightage_%     │         │ end_date        │                            │
│  └─────────────────┘         │ status          │                            │
│                              └────────┬────────┘                            │
│                                       │                                      │
│  ┌────────────────────────────────────▼────────────────────────────────┐    │
│  │                         exam_schedule                                │    │
│  ├──────────────────────────────────────────────────────────────────────┤   │
│  │ exam_id (FK) ────────────────> exams.id                              │   │
│  │ subject_id (FK) ─────────────> subjects.id                           │   │
│  │ exam_date, start_time, end_time                                      │   │
│  │ room_id (FK) ────────────────> rooms.id                              │   │
│  │ question_paper_uploaded, question_paper_path                         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                              marks                                    │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │ exam_schedule_id (FK) ───────> exam_schedule.id                      │    │
│  │ student_id (FK) ─────────────> students.id                           │    │
│  │ marks_obtained, grade                                                │    │
│  │ entered_by (FK), verified_by (FK) ────> staff.id                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                           timetables                                  │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │ class_id (FK) ───────────────> classes.id                            │    │
│  │ section_id (FK) ─────────────> sections.id                           │    │
│  │ day (day_of_week)                                                    │    │
│  │ period_id (FK) ──────────────> attendance_periods.id                 │    │
│  │ subject_id (FK) ─────────────> subjects.id                           │    │
│  │ teacher_id (FK) ─────────────> staff.id                              │    │
│  │ room_id (FK) ────────────────> rooms.id                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Fee Management

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BRANCH SCHEMA - FEE MANAGEMENT                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────┐         ┌─────────────────┐                            │
│  │ fee_categories  │         │  fee_structure  │                            │
│  ├─────────────────┤         ├─────────────────┤                            │
│  │ id (PK)         │◄────────│ fee_category_id │                            │
│  │ category_name   │         │ class_id (FK)   │                            │
│  │ is_mandatory    │         │ academic_year   │                            │
│  │ payment_cycle   │         │ amount          │                            │
│  │ late_fee_amount │         └─────────────────┘                            │
│  └────────┬────────┘                                                         │
│           │                                                                  │
│  ┌────────▼─────────────────────────────────────────────────────────────┐   │
│  │                          student_fees                                 │   │
│  ├───────────────────────────────────────────────────────────────────────┤   │
│  │ student_id (FK) ─────────────> students.id                            │   │
│  │ fee_category_id (FK) ────────> fee_categories.id                      │   │
│  │ total_amount, paid_amount, pending_amount                             │   │
│  │ due_date, status, waiver_amount                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                          fee_payments                                 │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │ receipt_number, student_id (FK) ────> students.id                    │    │
│  │ amount, payment_method, payment_date                                  │    │
│  │ transaction_id, bank_name                                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│  ┌─────────────────┐         ┌─────────────────────────────┐               │
│  │  scholarships   │         │    student_scholarships     │               │
│  ├─────────────────┤         ├─────────────────────────────┤               │
│  │ id (PK)         │◄────────│ scholarship_id (FK)         │               │
│  │ scholarship_name│         │ student_id (FK) ─> students │               │
│  │ discount_type   │         │ academic_year, is_active    │               │
│  │ discount_value  │         └─────────────────────────────┘               │
│  └─────────────────┘                                                         │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Transport, Library, Hostel, Mess, Canteen, Lab, Inventory

(These modules follow similar patterns with their respective entities - see branch_template.sql for full schema)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     BRANCH SCHEMA - OTHER MODULES                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  TRANSPORT: vehicles → routes → route_stops → student_transport              │
│             diesel_requests → fuel_logs → vehicle_maintenance                │
│                                                                               │
│  LIBRARY:  books → book_issues → library_fines                               │
│                                                                               │
│  HOSTEL:   hostel_buildings → hostel_rooms → hostel_beds                     │
│            hostel_allotment_requests → hostel_attendance                     │
│                                                                               │
│  MESS:     mess_menu → mess_billing → guest_meals → menu_approval_requests   │
│                                                                               │
│  CANTEEN:  canteen_counters → canteen_items → canteen_inventory             │
│            canteen_wallets → wallet_transactions → canteen_orders            │
│                                                                               │
│  LAB:      lab_equipment → lab_equipment_issues → lab_equipment_damage       │
│            lab_consumables                                                    │
│                                                                               │
│  INVENTORY: inventory_categories → inventory_items → inventory_transactions │
│             purchase_requests → inventory_damage_loss                        │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Relationships Summary

| Entity | Relationship | Related To |
|--------|--------------|------------|
| students | belongs to | class, section |
| students | has many | parents (via student_parents) |
| students | has many | fees, attendance, marks |
| staff | belongs to | department |
| staff | has many | attendance, leaves, salary |
| classes | has many | sections, subjects (via class_subjects) |
| rooms | belongs to | building, floor |
| exams | has many | exam_schedule, marks, report_cards |
| branches | has one | schema (branch_1, branch_2, etc.) |
| users | has many | branch_access (via user_branch_access) |
