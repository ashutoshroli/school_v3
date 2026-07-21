# Multi-Branch School Management ERP — Final Specification

## 1. Overview
- Multi-user School Management ERP for Director, Principal, VP, Staff, Parents, Students, Siblings, etc.
- Responsive, PWA-based application (mobile-first, works on desktop/tablet/mobile).
- Currently planning **3 branches**, each with **15,000 students**; Super Admin can add more branches later.
- Each branch has a separate/independent fee structure (per Branch Independence Principle, section 2).
- **Hosting plan:**
  - Phase 1 (current): Vercel (frontend) + Render (backend) + Supabase (DB/Auth/Storage) + Cloudflare R2 — free/trial tier.
  - Phase 2 (later): migrate to Hostinger's all-in-one web app hosting.
  - Production target: **Docker-based deployment** for this multi-branch, 15k-per-branch scale.

---

## 2. Database Architecture
- Single PostgreSQL database.
- **Schema-per-branch model**: `branch_1`, `branch_2`, ... each with its own full table set (students, staff, rooms, fees, attendance, etc.).
- Global/control schema: holds branch list, Super Admin account, cross-branch config.
- Adding a new branch **auto-clones** the schema/table structure — no manual table creation needed.
- **Branch Independence Principle**: every branch is fully independent by default — own fee structure, HR, scholarship policy, academic calendar, timetable rules. Nothing is shared across branches except explicit transfer-related exceptions (dues carry-forward, full academic data request/approval).

---

## 3. Roles & Permissions
```
Super Admin
  └── Only role that can DELETE anything
  └── Creates Admin accounts
  └── Global bypass flag overrides all RLS/permission checks

Admin / Director
  └── Create/Edit EVERYTHING (branches, students, staff, rooms, fees)
  └── Cannot delete — deletions are soft-delete/archive only
  └── Directly transfers students/staff between branches (no approval needed)
  └── Approves his own leave himself
  └── Manually enters payroll increment %; only role that can manually edit salary

Principal / VP
  └── Scoped to their own branch only
  └── Full control within their branch (exams, timetable, fee waivers, room booking approval, etc.)

Staff / Teacher
  └── Scoped to own class/subject/cabin

Parent / Student
  └── Scoped to own data (per-child breakdown for siblings)
```

### Authentication
- Login: Gmail login + custom username/password login.
- Password reset: via Academic section, or via email verification link.
- Every user can update their own email, username, and password.
- "Remember Me" option on login; responsive/PWA layout.

---

## 4. Building & Room Management
**Hierarchy:** Branch → Building/Block → Floor → Room → Cabin

**Room fields:** Room code, Room Type, Capacity, Direction from main gate (plain text), Department, Status (Active/Maintenance/Vacant).

**Room Types:** Classroom, Labs (Physics/Chemistry/Biology/Computer), Library, Principal's Chamber + Waiting Area, VP Chamber, Teachers' Chamber (multi-cabin, 1 cabin per teacher), HOD/Dept Office, Admin/Front Office, Accounts, Reception, Auditorium, Sports Room, Medical Room, Store Room, Server/IT Room, Cafeteria, Conference Room, Washrooms, Parking/Transport Office.

**Rules:**
- Shared room booking (Conference Room, Auditorium, etc.) requires Principal approval.
- Regular subject classes happen in the assigned classroom; lab-based subjects shift to the respective Lab room for that period.
- If room capacity is exceeded (e.g., new admission over capacity) → system shows a **warning only**, does not block.

---

## 5. Branch Transfer (Students & Staff)

**Transfer initiation:**
- **Director** → transfers directly, no approval required.
- **Principal-initiated** → Origin Principal sends transfer request → Destination Principal approves/rejects.

**Academic data visibility after transfer:**
- Default: destination branch sees only a **summary** of academic record.
- Full data unlock: Destination Principal sends a "full data" request → **Origin Principal** approves/rejects.

**Fee dues at transfer** — when dues exist at origin branch, Destination Principal chooses one of 3 options:
1. **Carry Forward** — dues move to new branch's account; student stays **active immediately**.
2. **Clear Dues & Take Admission** — dues carried to new branch's account, but student marked **inactive** until those dues are cleared there.
3. **Clear at Old Branch** — dues must be cleared in the old branch's ledger before admission proceeds at all.

**Scholarship:** Branch-linked — auto-cancelled on transfer; must be reapplied/reassessed at the new branch under its own rules.

---

## 6. Attendance

### Student Attendance
- Multi-period per day.
- Period 1 marking auto-copies as the default to all subsequent periods same day.
- A period-specific teacher can override just their own period without affecting others.
- Also RFID in/out tap based (same logic style as Hostel module), but Class Teacher must additionally mark/verify — both auto-tracking and manual verification apply together.

### Teacher Attendance
- RFID card tap (in/out) per period — records in-time and out-time.
- RFID hardware: **both** fixed reader (installed at doors) and mobile/tablet tap supported.
- **Late/Early Penalty Rule:**
  - Late-entries + Early-exits are counted **combined** (not separate).
  - Every 5 combined occurrences → deducts 1 period from that day's attendance (recurring: 6th–10th → another deduction, and so on).
  - Week cycle = school's own **custom week** (not fixed Mon–Sun).

### Attendance Calculation
- Daily attendance % is calculated on a **per-period basis** — one absent period only counts that period as absent, not the whole day.

---

## 7. Leave Management
- **Approval chain (2-level):** Staff → VP → Principal.
- VP/Principal's own leave → approved by **Director**. Director approves his own leave himself.
- Leave quota: **role-wise AND branch-wise** (not a single uniform quota).
- Approved leave auto-marks attendance as "On Leave" (RFID no-tap on leave day ≠ absent).
- Leave approval triggers substitute/cover teacher assignment (period-wise) — supports both **system auto-suggest** and **manual assignment**.
- Leave balance handling: **carry-forward, lapse, and encash** — all three supported, configurable staff-wise and role-wise.
- Working days for leave quota are **auto-calculated per role, per branch, per year**, factoring in holidays; Director can also set a custom working-days count for specific staff.
- **Leave types:** default list (Casual Leave, Sick Leave, Earned Leave, Unpaid Leave, Maternity/Paternity Leave) used as the base — Director can add or modify leave types.

---

## 8. Payroll / Salary Management

### Appraisal Rating Sources
| Source | Frequency | Notes |
|---|---|---|
| Student Rating | Weekly | Individually by every student, per teacher assigned to their class |
| Parent Rating | After every PTM | All parents fill a rating + feedback form |
| Principal ↔ Teacher | Quarterly (3 months) | Mutual — Principal rates teacher AND teacher rates Principal |
| VP ↔ Teacher | Quarterly (3 months) | Same mutual pattern as Principal |
| Attendance Performance | Continuous | Auto-tracked from attendance module |

- Increment screen shows raw data + average per rating source, per staff.
- **Director manually enters the increment % himself** — no auto-formula.

### Salary Structure
- Components (Basic, Allowances - HRA/DA/Transport, Deductions) — configurable **branch-wise and role-wise**.
- Monthly attendance for salary is counted as **%** (present/assigned or completed periods), not raw day-count; the 5-late/early penalty rule feeds into this % at salary calculation time.
- **Manual salary edit: Admin only.**

---

## 9. Exam Module

### Exam Creation Rights
- **Principal** — any scope (class-wise, section-wise, batch-wise, custom).
- **Class Teacher** — custom exam for own class only.
- **Subject Teacher** — exam for their assigned class-subject only.

### Conflict Handling
- Scheduling conflicts show a **warning** (not auto-blocked).
- If Principal schedules over an existing class/subject teacher's exam → a postponement request is sent to that teacher → no response → auto-approved → that teacher's exam is **postponed** (not cancelled) → teacher sets the new date.
- Class/Subject Teacher created exams need **no approval** — go live directly.

### Exam Types
All types supported: Unit Test, Mid-term, Final, Class Test/Surprise Test, etc.

### Grading & Report Card
- Grading system configurable **branch-wise** (marks-based vs grade/GPA-based).
- Report card weightage per exam type set by **Principal** (e.g., Final vs Mid-term vs Unit Test %).

### Question Paper Pipeline
```
Principal creates Exam
    ↓
All Subject Teachers get a deadline to upload their questions (PDF or JPEG)
    ↓
If a teacher misses the deadline → Principal notified →
   Principal can upload questions as a fallback →
   logged in that teacher's remarks/records
    ↓
Exam Department formats the paper
    ↓
Checks required paper quantity room/classroom-wise (based on seating)
    ↓
Printing
```

### Full Exam Process Flow
```
Exam created & published
    ↓
Timetable created & published
    ↓
Seat plan created & published
    ↓
Exam attendance
    ↓
Copy-checking teacher assigned
    ↓
Marks entry
    ↓
Verification teacher checks marks entry against offline TR (Tabulation Register) sheet
    ↓
Exam Department — additional verification if needed
    ↓
Final verification by Principal
    ↓
Result published
```

---

## 10. Homework Management
- Student/Parent uploads submission via app.
- If not uploaded by them, **Class Teacher** updates it manually.
- Submission status: **Late Submission (flagged)** or **Not Submitted**.
- Every parent can see all homework assigned to each of their children (per-child breakdown).
- **Grading:** Subject Teacher only, after the deadline — **1–5 rating with remarks**, visible to parents and students.
- **Recheck request flow:**
  ```
  Student/Parent raises recheck request
       ↓
  Class Teacher (1st level)
       ↓ (if that teacher's recheck-request count exceeds a
           max threshold, set by Super Admin)
  Principal (escalation)
       ↓ (beyond that)
  Director (final escalation)
  ```

---

## 11. Transport Module
- **Vehicle types:** Own and Rented — **both** get a full management system (fuel/maintenance/diesel-request tracking).
- **Rented vehicle payment:** Monthly fixed + custom/weekly custom + on-demand diesel entries (added anytime); diesel cost = per-km rate × distance on assigned route; each rented vehicle has its own per-km rate.
- **Route distance:** measured once by Transport In-charge; diesel distance auto-calculated from it (view-only), but Transport Manager can manually override/fix.
- **GPS tracking:** required (live location).
- **Attendance:** RFID (tracks students boarding/alighting).
- **Fee:** stop-wise / distance-wise (not flat).
- **Diesel payment flow:**
  ```
  Driver raises diesel request (amount + litres)
      ↓
  Transport Manager approves
      ↓
  Accounts section (as account-transfer request)
      ↓
  Director approves payment
      ↓
  Online → payment transferred | Not online → Accounts releases cash directly
  ```
- **Rejection handling:** driver notified with reason; can re-request, capped at **max 3 re-requests per week**.

---

## 12. Library Module
- Book management tracks physical location (rack/shelf) of every book.
- Book entry captures both **purchase rate** and **current book rate**.
- **Fine (late return)** and **Lost/damaged cost**: set by Director; Principal can waive fully or partially (custom amount or %).
- Branch-wise lost/damage cost setup — two modes:
  - (a) Fixed flat amount for any lost/damaged book, OR
  - (b) Book-wise custom % of book rate (separate % for lost vs damaged).
- **Issue limit:** Students max 3 books, Staff max 10 books at a time.

---

## 13. Hostel Module
- **Room types:** Single, Double, Triple, or Custom.
- **Fee:** room-type-wise, per-bed rate.
- **Bed allotment flow:**
  - Empty room → student requests → auto-allotted (provisional, until a custom cutoff date set/published by Warden).
  - Occupied room → new student's request goes to the existing roommate first → only if they approve does the new student get auto-allotted.
  - If roommate rejects → student shown next suggested available room + can do custom room selection.
- Final allotment list published only after **Warden** completes all approvals; Warden can modify/override and allocate new students directly.
- **Attendance:** RFID tap in/out on every entry/exit; presence derived from the **last tap** (last tap = "in" with no subsequent "out" → considered present/inside).

---

## 14. Mess Module
- Meal plan: **week-wise**, veg/non-veg options.
- Billing: **monthly fixed** (not per-meal-consumed).
- Bill waiver: by Principal, or via a Warden-approved leave (waives billing for that period).
- Menu approval chain: **Mess Incharge → Warden → Principal → Director**.
- Guest meals: parents eat free; other guests are chargeable per meal.

---

## 15. Canteen Module
- Full inventory management: stock in/out, rack/counter-wise placement, multi-counter management, appliance management (equipment, maintenance, warranty/AMC — with full auto-reminders/alerts).
- Billing: **both** prepaid wallet (RFID) and cash/counter billing.
- Wallet recharge: online + cash-at-counter; can be done by **parent or student**.
- Stock replenish approval: same flow as diesel (Incharge → Manager approval → Accounts → Director payment approval).

---

## 16. Lab Management Module (higher-class labs)
- Equipment issue by Lab Assistant — supports both **group** and **individual** issue.
- Damage/breakage fine: added by Lab Assistant, **waivable by Principal**.
- Chemical/consumable expiry: auto-alert required before expiry.

---

## 17. Inventory Module (school-wide)
- Covers all categories: furniture, stationery, sports equipment, electronics, cleaning supplies, etc. — branch-wise.
- Purchase/reorder approval: same chain as diesel/canteen (Incharge → Manager → Accounts → Director).
- Item issue to a department/room/staff logged in a register (who took it, return status if returnable).
- Asset damage/loss: same fine/waiver pattern (Incharge adds cost, Principal can waive).

---

## 18. Admission Process
```
1. Enquiry Received (public landing page or walk-in via Front Office)
2. Application Form + Documents Submission
3. Entrance Test — applies to ALL classes
4. Seat Availability Check
     → Class/Section full → system shows WARNING ONLY (does not block)
5. Approval → FRONT OFFICE (final approval authority)
6. Admission Fee Payment → online / fee counter / admission counter (any of 3)
     → Special offer: paying on the day of Saraswati Puja gets a
       discount (custom ₹ amount or %, configurable) — admission fee only,
       does not apply to existing students' term/year fees
7. Admission Confirmed
     → Class & Section assigned ON THE ADMISSION DATE
     → Roll Number assigned on the STUDENT'S FIRST ATTENDANCE DAY (not at admission)
```

**Roll number assignment rule** — branch-wise configurable:
- Performance-based, OR
- Fees-based (students who clear all dues first get priority)
- Alphabetical order used as the fallback/tiebreaker in either case.

---

## 19. Fee Structure

**Fee Categories** (branch-wise, configurable): Admission Fee (one-time), Tuition Fee, Transport Fee (opt-in), Hostel Fee (opt-in), Exam Fee, Activity/Misc Fee, Late Fee.

**Category assignment:**
- Both **automatic** (system auto-maps category by class) and **manual** (Admin/Accounts can override/assign) are supported.
- Director/Principal can create **custom fee categories** and mark each as mandatory or optional (opt-in).
- **Sibling discount** is NOT automatic — requires manual approval by the Principal.

**Payment cycle:** configurable both **branch-wise and class-wise** (e.g., Branch A + Nursery = monthly, Branch A + Class 10 = quarterly; each branch/class combination can differ).

**Late fee:**
- Fixed amount, configurable **per fee category**, applied per-day or per-month depending on category.
- **3-day grace period** after due date before late fee starts applying.

**Partial payment:** Allowed, with **no minimum amount/percentage** requirement.

---

## 20. Timetable

### Class Timetable
- Creation rights: **Principal**.
- Clash detection (teacher/room double-booking) is **branch-configurable** — each branch chooses warning-only or hard block.
- Substitute teacher assignment on staff leave: done by **Principal**, with **system-suggested options**.

### Exam Timetable
- No fixed gap rule between exams — **branch-wise custom** gap setting instead.
- **Invigilator clash auto-check** required — system prevents/flags a teacher from being double-assigned to exam duty.

---

## 21. Public Landing Page (no login required)
- **Home** page + **Gallery** + general info.
- **Notifications** section (public notices).
- **Result Check**: lookup by Class + Section + Roll No / Admission No + Date of Birth (public, no login).
- **Fee Check / Pay**: lookup by Class + Section + Roll No / Admission No (same identifier style as result check).
- **Admission Enquiry** section.
- **Requirements** page (admission eligibility/document requirements).
- **Forms**: Admission Application Form, Requirement/Enquiry Form, Feedback Form.
  - All these forms include a **branch checklist** — applicant selects which branch(es) they're applying to/enquiring about (multi-select).
  - When multiple branches are selected, notifications go out in **priority order** (the order the applicant selected them in) — if rejected by one branch, the request automatically moves to the next branch on the list.

---

## 22. Notifications
- Channels for now: **Email** and **Push Notification** (via the app/PWA).
- SMS/WhatsApp integration deferred to a later phase.

---

## 23. Still Open / Not Yet Decided
- Exact concurrent user scale target for the Docker production setup.
- Exact leave quota numbers per role/branch (e.g., how many CL/SL/EL days each role gets).

---

## Suggested Build Order (for AI coding tool)
1. Database schema (ERD) covering all entities above, with schema-per-branch structure.
2. Auth + RBAC middleware (role hierarchy + permission checks + Super Admin bypass flag).
3. Core: Branch management (create/clone schema) → Building/Room management → Student/Staff CRUD.
4. One working end-to-end flow first: Admin creates student → Parent linked → Parent dashboard.
5. Attendance + Leave modules (RFID integration points, even if mocked initially).
6. Fee + Admission modules.
7. Exam + Timetable modules.
8. Transport / Library / Hostel / Mess / Canteen / Lab / Inventory (each is fairly self-contained; build after core is stable).
9. Public landing page + notification system last, once core data models exist to query against.
</file_text>