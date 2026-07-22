const db = require('../config/database');
const Branch = require('../models/Branch');

class DashboardController {
  async getSuperAdminDashboard(req, res, next) {
    try {
      const result = await db.query(
        `SELECT 
         COUNT(*) as total_branches,
         COUNT(*) FILTER (WHERE status = 'active') as active_branches
         FROM global.branches`
      );

      const branches = result.rows[0];

      res.json({
        success: true,
        data: {
          totalBranches: parseInt(branches.total_branches),
          activeBranches: parseInt(branches.active_branches)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getBranchDashboard(req, res, next) {
    try {
      const { branchId } = req.params;
      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;

      // Get various statistics
      const [students, staff, fees, attendance] = await Promise.all([
        db.query(
          `SELECT 
           COUNT(*) as total,
           COUNT(*) FILTER (WHERE status = 'active') as active,
           COUNT(*) FILTER (WHERE gender = 'male') as male,
           COUNT(*) FILTER (WHERE gender = 'female') as female
           FROM ${schema}.students WHERE is_deleted = FALSE`
        ),
        db.query(
          `SELECT 
           COUNT(*) as total,
           COUNT(*) FILTER (WHERE status = 'active') as active,
           COUNT(*) FILTER (WHERE role = 'teacher') as teachers
           FROM ${schema}.staff WHERE is_deleted = FALSE`
        ),
        db.query(
          `SELECT 
           SUM(total_amount) as total_fees,
           SUM(paid_amount) as collected_fees,
           SUM(pending_amount) as pending_fees
           FROM ${schema}.student_fees WHERE academic_year = '2024-25'`
        ),
        db.query(
          `SELECT 
           COUNT(*) FILTER (WHERE status = 'present') as present,
           COUNT(*) FILTER (WHERE status = 'absent') as absent
           FROM ${schema}.student_attendance 
           WHERE date = CURRENT_DATE`
        )
      ]);

      res.json({
        success: true,
        data: {
          students: {
            total: parseInt(students.rows[0].total),
            active: parseInt(students.rows[0].active),
            male: parseInt(students.rows[0].male),
            female: parseInt(students.rows[0].female)
          },
          staff: {
            total: parseInt(staff.rows[0].total),
            active: parseInt(staff.rows[0].active),
            teachers: parseInt(staff.rows[0].teachers)
          },
          fees: {
            total: parseFloat(fees.rows[0].total_fees || 0),
            collected: parseFloat(fees.rows[0].collected_fees || 0),
            pending: parseFloat(fees.rows[0].pending_fees || 0),
            collectionPercentage: fees.rows[0].total_fees 
              ? ((fees.rows[0].collected_fees / fees.rows[0].total_fees) * 100).toFixed(2)
              : 0
          },
          todayAttendance: {
            present: parseInt(attendance.rows[0].present || 0),
            absent: parseInt(attendance.rows[0].absent || 0)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getTeacherDashboard(req, res, next) {
    try {
      const { branchId, staffId } = req.params;
      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;

      // Get teacher's classes and subjects
      const [classes, subjects, leaveBalance] = await Promise.all([
        db.query(
          `SELECT DISTINCT c.id, c.class_name, sec.section_name
           FROM ${schema}.class_subjects cs
           JOIN ${schema}.classes c ON cs.class_id = c.id
           LEFT JOIN ${schema}.sections sec ON sec.class_id = c.id
           WHERE cs.teacher_id = $1`,
          [staffId]
        ),
        db.query(
          `SELECT s.id, s.subject_name
           FROM ${schema}.class_subjects cs
           JOIN ${schema}.subjects s ON cs.subject_id = s.id
           WHERE cs.teacher_id = $1`,
          [staffId]
        ),
        db.query(
          `SELECT lt.leave_name, lb.remaining_days
           FROM ${schema}.leave_balance lb
           JOIN ${schema}.leave_types lt ON lb.leave_type_id = lt.id
           WHERE lb.staff_id = $1 AND lb.year = $2`,
          [staffId, new Date().getFullYear()]
        )
      ]);

      res.json({
        success: true,
        data: {
          classes: classes.rows,
          subjects: subjects.rows,
          leaveBalance: leaveBalance.rows
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudentDashboard(req, res, next) {
    try {
      const { branchId, studentId } = req.params;
      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;

      const [student, fees, attendance, homework] = await Promise.all([
        db.query(
          `SELECT s.*, c.class_name, sec.section_name
           FROM ${schema}.students s
           LEFT JOIN ${schema}.classes c ON s.class_id = c.id
           LEFT JOIN ${schema}.sections sec ON s.section_id = sec.id
           WHERE s.id = $1`,
          [studentId]
        ),
        db.query(
          `SELECT SUM(pending_amount) as pending
           FROM ${schema}.student_fees 
           WHERE student_id = $1 AND academic_year = '2024-25'`,
          [studentId]
        ),
        db.query(
          `SELECT 
           COUNT(*) FILTER (WHERE status = 'present') as present,
           COUNT(*) FILTER (WHERE status = 'absent') as absent,
           COUNT(*) as total
           FROM ${schema}.student_attendance 
           WHERE student_id = $1 
           AND date >= DATE_TRUNC('month', CURRENT_DATE)`,
          [studentId]
        ),
        db.query(
          `SELECT h.*, s.subject_name,
           CASE WHEN hs.id IS NOT NULL THEN true ELSE false END as submitted
           FROM ${schema}.homework h
           JOIN ${schema}.subjects s ON h.subject_id = s.id
           LEFT JOIN ${schema}.homework_submissions hs ON h.id = hs.homework_id AND hs.student_id = $1
           WHERE h.class_id = (SELECT class_id FROM ${schema}.students WHERE id = $1)
           AND h.due_date >= CURRENT_DATE
           ORDER BY h.due_date`,
          [studentId]
        )
      ]);

      res.json({
        success: true,
        data: {
          profile: student.rows[0],
          pendingFees: parseFloat(fees.rows[0].pending || 0),
          monthlyAttendance: {
            present: parseInt(attendance.rows[0].present || 0),
            absent: parseInt(attendance.rows[0].absent || 0),
            percentage: attendance.rows[0].total > 0 
              ? ((attendance.rows[0].present / attendance.rows[0].total) * 100).toFixed(2)
              : 0
          },
          pendingHomework: homework.rows
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getParentDashboard(req, res, next) {
    try {
      const { branchId, parentId } = req.params;
      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;

      // Get children
      const childrenResult = await db.query(
        `SELECT s.id, s.admission_number, s.full_name, c.class_name, sec.section_name
         FROM ${schema}.students s
         JOIN ${schema}.student_parents sp ON s.id = sp.student_id
         JOIN ${schema}.parents p ON sp.parent_id = p.id
         LEFT JOIN ${schema}.classes c ON s.class_id = c.id
         LEFT JOIN ${schema}.sections sec ON s.section_id = sec.id
         WHERE p.id = $1 AND s.is_deleted = FALSE`,
        [parentId]
      );

      const children = childrenResult.rows;

      // Get fee summary for all children
      for (const child of children) {
        const feeResult = await db.query(
          `SELECT SUM(pending_amount) as pending
           FROM ${schema}.student_fees 
           WHERE student_id = $1 AND academic_year = '2024-25'`,
          [child.id]
        );
        child.pendingFees = parseFloat(feeResult.rows[0].pending || 0);
      }

      res.json({
        success: true,
        data: { children }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
