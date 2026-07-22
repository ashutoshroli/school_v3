const db = require('../config/database');
const Branch = require('../models/Branch');
const { v4: uuidv4 } = require('uuid');

class LeaveController {
  // Leave Types
  async listLeaveTypes(req, res, next) {
    try {
      const { branchId } = req.params;
      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const result = await db.query(
        `SELECT * FROM ${schema}.leave_types ORDER BY leave_name`
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  }

  // Leave Balance
  async getLeaveBalance(req, res, next) {
    try {
      const { branchId, staffId } = req.params;
      const { year } = req.query;

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const result = await db.query(
        `SELECT lb.*, lt.leave_name, lt.leave_type
         FROM ${schema}.leave_balance lb
         JOIN ${schema}.leave_types lt ON lb.leave_type_id = lt.id
         WHERE lb.staff_id = $1 AND lb.year = $2`,
        [staffId, year || new Date().getFullYear()]
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  }

  // Leave Requests
  async listLeaveRequests(req, res, next) {
    try {
      const { branchId } = req.params;
      const { staffId, status } = req.query;

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      let whereClause = 'WHERE 1=1';
      const params = [];

      if (staffId) {
        whereClause += ` AND lr.staff_id = $${params.length + 1}`;
        params.push(staffId);
      }

      if (status) {
        whereClause += ` AND lr.status = $${params.length + 1}`;
        params.push(status);
      }

      const result = await db.query(
        `SELECT lr.*, s.full_name as staff_name, lt.leave_name,
         approver1.full_name as level_1_approver_name,
         approver2.full_name as level_2_approver_name
         FROM ${schema}.leave_requests lr
         JOIN ${schema}.staff s ON lr.staff_id = s.id
         JOIN ${schema}.leave_types lt ON lr.leave_type_id = lt.id
         LEFT JOIN ${schema}.staff approver1 ON lr.level_1_approver_id = approver1.id
         LEFT JOIN ${schema}.staff approver2 ON lr.level_2_approver_id = approver2.id
         ${whereClause}
         ORDER BY lr.created_at DESC`,
        params
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  }

  async applyLeave(req, res, next) {
    try {
      const { branchId } = req.params;
      const { staffId, leaveTypeId, startDate, endDate, totalDays, reason, documentPath } = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;

      // Check leave balance
      const balanceResult = await db.query(
        `SELECT remaining_days FROM ${schema}.leave_balance 
         WHERE staff_id = $1 AND leave_type_id = $2 AND year = $3`,
        [staffId, leaveTypeId, new Date().getFullYear()]
      );

      if (balanceResult.rows.length === 0 || balanceResult.rows[0].remaining_days < totalDays) {
        return res.status(400).json({ error: 'Insufficient leave balance' });
      }

      const id = uuidv4();
      const result = await db.query(
        `INSERT INTO ${schema}.leave_requests 
         (id, staff_id, leave_type_id, start_date, end_date, total_days, reason, document_path, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
         RETURNING *`,
        [id, staffId, leaveTypeId, startDate, endDate, totalDays, reason, documentPath]
      );

      res.status(201).json({
        success: true,
        message: 'Leave request submitted successfully',
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }

  async approveLeave(req, res, next) {
    try {
      const { branchId, leaveId } = req.params;
      const { level, comments, approved } = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;

      const leaveResult = await db.query(
        `SELECT * FROM ${schema}.leave_requests WHERE id = $1`,
        [leaveId]
      );

      if (leaveResult.rows.length === 0) {
        return res.status(404).json({ error: 'Leave request not found' });
      }

      const leave = leaveResult.rows[0];
      const approverId = req.user?.id;
      const approvalStatus = approved ? 'approved' : 'rejected';

      if (level === 1) {
        await db.query(
          `UPDATE ${schema}.leave_requests 
           SET level_1_status = $1, level_1_comments = $2, level_1_approver_id = $3, 
               level_1_approved_at = NOW(),
               status = CASE WHEN $1 = 'rejected' THEN 'rejected' ELSE status END,
               current_level = CASE WHEN $1 = 'approved' THEN 2 ELSE current_level END,
               updated_at = NOW()
           WHERE id = $4`,
          [approvalStatus, comments, approverId, leaveId]
        );
      } else if (level === 2) {
        await db.query(
          `UPDATE ${schema}.leave_requests 
           SET level_2_status = $1, level_2_comments = $2, level_2_approver_id = $3, 
               level_2_approved_at = NOW(),
               status = $1,
               updated_at = NOW()
           WHERE id = $4`,
          [approvalStatus, comments, approverId, leaveId]
        );

        // Update leave balance if approved
        if (approved) {
          await db.query(
            `UPDATE ${schema}.leave_balance 
             SET used_days = used_days + $1, remaining_days = remaining_days - $1
             WHERE staff_id = $2 AND leave_type_id = $3 AND year = $4`,
            [leave.total_days, leave.staff_id, leave.leave_type_id, new Date().getFullYear()]
          );

          // Mark attendance as on_leave
          const dates = this.getDatesBetween(leave.start_date, leave.end_date);
          for (const date of dates) {
            await db.query(
              `INSERT INTO ${schema}.staff_attendance (staff_id, date, status)
               VALUES ($1, $2, 'on_leave')
               ON CONFLICT DO NOTHING`,
              [leave.staff_id, date]
            );
          }
        }
      }

      res.json({
        success: true,
        message: `Leave ${approvalStatus} successfully`
      });
    } catch (error) {
      next(error);
    }
  }

  getDatesBetween(startDate, endDate) {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }
}

module.exports = new LeaveController();
