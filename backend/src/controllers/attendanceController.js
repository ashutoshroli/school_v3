const db = require('../config/database');
const Branch = require('../models/Branch');
const { validatePagination } = require('../middleware/validators');

class AttendanceController {
  // Student Attendance
  async getStudentAttendance(req, res, next) {
    try {
      const { branchId, studentId } = req.params;
      const { date, startDate, endDate } = req.query;

      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const schema = branch.schema_name;
      let whereClause = 'WHERE student_id = $1';
      const params = [studentId];

      if (date) {
        whereClause += ` AND date = $${params.length + 1}`;
        params.push(date);
      } else if (startDate && endDate) {
        whereClause += ` AND date BETWEEN $${params.length + 1} AND $${params.length + 2}`;
        params.push(startDate, endDate);
      }

      const result = await db.query(
        `SELECT sa.*, ap.period_name, ap.start_time, ap.end_time
         FROM ${schema}.student_attendance sa
         JOIN ${schema}.attendance_periods ap ON sa.period_id = ap.id
         ${whereClause}
         ORDER BY sa.date DESC, ap.start_time`,
        params
      );

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      next(error);
    }
  }

  async markStudentAttendance(req, res, next) {
    try {
      const { branchId } = req.params;
      const { studentId, date, periodId, status, remarks } = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const schema = branch.schema_name;

      const result = await db.query(
        `INSERT INTO ${schema}.student_attendance (student_id, date, period_id, status, remarks, marked_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (student_id, date, period_id) 
         DO UPDATE SET status = $4, remarks = $5, marked_by = $6, marked_at = NOW()
         RETURNING *`,
        [studentId, date, periodId, status, remarks, req.user?.id]
      );

      res.json({
        success: true,
        message: 'Attendance marked successfully',
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }

  async bulkMarkStudentAttendance(req, res, next) {
    try {
      const { branchId } = req.params;
      const { date, periodId, classId, sectionId, attendanceData } = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const schema = branch.schema_name;

      // Get all students in class-section
      const studentsResult = await db.query(
        `SELECT id FROM ${schema}.students 
         WHERE class_id = $1 AND section_id = $2 AND is_deleted = FALSE AND status = 'active'`,
        [classId, sectionId]
      );

      const results = [];
      for (const student of studentsResult.rows) {
        const studentAttendance = attendanceData.find(a => a.studentId === student.id);
        const status = studentAttendance?.status || 'present';

        const result = await db.query(
          `INSERT INTO ${schema}.student_attendance (student_id, date, period_id, status, marked_by)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (student_id, date, period_id) 
           DO UPDATE SET status = $4, marked_by = $5, marked_at = NOW()
           RETURNING *`,
          [student.id, date, periodId, status, req.user?.id]
        );
        results.push(result.rows[0]);
      }

      res.json({
        success: true,
        message: `Attendance marked for ${results.length} students`,
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  // Staff Attendance
  async getStaffAttendance(req, res, next) {
    try {
      const { branchId, staffId } = req.params;
      const { month, year } = req.query;

      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const schema = branch.schema_name;

      const result = await db.query(
        `SELECT sa.*, ap.period_name
         FROM ${schema}.staff_attendance sa
         JOIN ${schema}.attendance_periods ap ON sa.period_id = ap.id
         WHERE sa.staff_id = $1 
         AND EXTRACT(MONTH FROM sa.date) = $2 
         AND EXTRACT(YEAR FROM sa.date) = $3
         ORDER BY sa.date, ap.start_time`,
        [staffId, month, year]
      );

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      next(error);
    }
  }

  async recordStaffRFID(req, res, next) {
    try {
      const { branchId } = req.params;
      const { cardNumber, tapType } = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const schema = branch.schema_name;

      // Find staff by RFID card
      const cardResult = await db.query(
        `SELECT assigned_to_id FROM ${schema}.rfid_cards 
         WHERE card_number = $1 AND assigned_to_type = 'staff'`,
        [cardNumber]
      );

      if (cardResult.rows.length === 0) {
        return res.status(404).json({ error: 'RFID card not found' });
      }

      const staffId = cardResult.rows[0].assigned_to_id;
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      // Get current period
      const periodResult = await db.query(
        `SELECT id FROM ${schema}.attendance_periods 
         WHERE start_time <= $1 AND end_time >= $1 AND is_break = FALSE
         ORDER BY start_time LIMIT 1`,
        [now.toTimeString().split(' ')[0]]
      );

      const periodId = periodResult.rows[0]?.id;

      if (tapType === 'in') {
        const result = await db.query(
          `INSERT INTO ${schema}.staff_attendance (staff_id, date, period_id, rfid_tap_in, status)
           VALUES ($1, $2, $3, $4, 'present')
           ON CONFLICT (staff_id, date, period_id) 
           DO UPDATE SET rfid_tap_in = $4
           RETURNING *`,
          [staffId, today, periodId, now]
        );
        return res.json({ success: true, message: 'Check-in recorded', data: result.rows[0] });
      } else {
        const result = await db.query(
          `UPDATE ${schema}.staff_attendance 
           SET rfid_tap_out = $1
           WHERE staff_id = $2 AND date = $3 AND period_id = $4
           RETURNING *`,
          [now, staffId, today, periodId]
        );
        return res.json({ success: true, message: 'Check-out recorded', data: result.rows[0] });
      }
    } catch (error) {
      next(error);
    }
  }

  // Attendance Summary
  async getAttendanceSummary(req, res, next) {
    try {
      const { branchId } = req.params;
      const { classId, sectionId, month, year } = req.query;

      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const schema = branch.schema_name;

      const result = await db.query(
        `SELECT s.id, s.admission_number, s.full_name,
         COUNT(CASE WHEN sa.status = 'present' THEN 1 END) as present_count,
         COUNT(CASE WHEN sa.status = 'absent' THEN 1 END) as absent_count,
         COUNT(CASE WHEN sa.status = 'late' THEN 1 END) as late_count,
         COUNT(*) as total_periods,
         ROUND(100.0 * COUNT(CASE WHEN sa.status = 'present' THEN 1 END) / NULLIF(COUNT(*), 0), 2) as attendance_percentage
         FROM ${schema}.students s
         LEFT JOIN ${schema}.student_attendance sa ON s.id = sa.student_id
         LEFT JOIN ${schema}.attendance_periods ap ON sa.period_id = ap.id
         WHERE s.class_id = $1 AND s.section_id = $2
         AND s.is_deleted = FALSE
         AND EXTRACT(MONTH FROM sa.date) = $3
         AND EXTRACT(YEAR FROM sa.date) = $4
         GROUP BY s.id, s.admission_number, s.full_name
         ORDER BY s.admission_number`,
        [classId, sectionId, month, year]
      );

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AttendanceController();
