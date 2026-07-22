const db = require('../config/database');
const Branch = require('../models/Branch');
const { validatePagination } = require('../middleware/validators');
const { v4: uuidv4 } = require('uuid');

class ExamController {
  // Exam Types
  async listExamTypes(req, res, next) {
    try {
      const { branchId } = req.params;
      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const result = await db.query(
        `SELECT * FROM ${schema}.exam_types ORDER BY exam_name`
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  }

  // Exams
  async listExams(req, res, next) {
    try {
      const { branchId } = req.params;
      validatePagination(req, res, () => {});

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const { page, limit, offset } = req.pagination;
      const { academicYear, status, classId } = req.query;

      let whereClause = 'WHERE 1=1';
      const params = [];

      if (academicYear) {
        whereClause += ` AND academic_year = $${params.length + 1}`;
        params.push(academicYear);
      }

      if (status) {
        whereClause += ` AND status = $${params.length + 1}`;
        params.push(status);
      }

      if (classId) {
        whereClause += ` AND class_id = $${params.length + 1}`;
        params.push(classId);
      }

      const result = await db.query(
        `SELECT e.*, c.class_name, et.exam_type, et.exam_name as type_name
         FROM ${schema}.exams e
         LEFT JOIN ${schema}.classes c ON e.class_id = c.id
         LEFT JOIN ${schema}.exam_types et ON e.exam_type_id = et.id
         ${whereClause}
         ORDER BY e.start_date DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limit, offset]
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  }

  async createExam(req, res, next) {
    try {
      const { branchId } = req.params;
      const { examName, examTypeId, classId, sectionId, scope, startDate, endDate, academicYear } = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const id = uuidv4();

      const result = await db.query(
        `INSERT INTO ${schema}.exams 
         (id, exam_name, exam_type_id, class_id, section_id, scope, start_date, end_date, academic_year, status, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'draft', $10)
         RETURNING *`,
        [id, examName, examTypeId, classId, sectionId, scope || 'class', startDate, endDate, academicYear, req.user?.id]
      );

      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  async updateExamStatus(req, res, next) {
    try {
      const { branchId, examId } = req.params;
      const { status } = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const result = await db.query(
        `UPDATE ${schema}.exams SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
        [status, examId]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  // Exam Schedule
  async getExamSchedule(req, res, next) {
    try {
      const { branchId, examId } = req.params;
      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const result = await db.query(
        `SELECT es.*, s.subject_name, r.room_name
         FROM ${schema}.exam_schedule es
         JOIN ${schema}.subjects s ON es.subject_id = s.id
         LEFT JOIN ${schema}.rooms r ON es.room_id = r.id
         WHERE es.exam_id = $1
         ORDER BY es.exam_date, es.start_time`,
        [examId]
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  }

  async addExamSchedule(req, res, next) {
    try {
      const { branchId } = req.params;
      const { examId, subjectId, examDate, startTime, endTime, maxMarks, passingMarks, roomId } = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const id = uuidv4();

      const result = await db.query(
        `INSERT INTO ${schema}.exam_schedule 
         (id, exam_id, subject_id, exam_date, start_time, end_time, max_marks, passing_marks, room_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [id, examId, subjectId, examDate, startTime, endTime, maxMarks, passingMarks, roomId]
      );

      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  // Marks Entry
  async getMarks(req, res, next) {
    try {
      const { branchId, examScheduleId } = req.params;
      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const result = await db.query(
        `SELECT m.*, s.admission_number, s.full_name as student_name
         FROM ${schema}.marks m
         JOIN ${schema}.students s ON m.student_id = s.id
         WHERE m.exam_schedule_id = $1
         ORDER BY s.admission_number`,
        [examScheduleId]
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  }

  async enterMarks(req, res, next) {
    try {
      const { branchId } = req.params;
      const { examScheduleId, marksData } = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const results = [];

      for (const item of marksData) {
        const id = uuidv4();
        const result = await db.query(
          `INSERT INTO ${schema}.marks 
           (id, exam_schedule_id, student_id, marks_obtained, max_marks, grade, is_absent, entered_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (exam_schedule_id, student_id)
           DO UPDATE SET marks_obtained = $4, grade = $6, is_absent = $7, entered_by = $8, entered_at = NOW()
           RETURNING *`,
          [id, examScheduleId, item.studentId, item.marksObtained, item.maxMarks, item.grade, item.isAbsent || false, req.user?.id]
        );
        results.push(result.rows[0]);
      }

      res.json({ success: true, message: `Marks entered for ${results.length} students`, data: results });
    } catch (error) {
      next(error);
    }
  }

  async verifyMarks(req, res, next) {
    try {
      const { branchId, examScheduleId } = req.params;
      const { level } = req.query;

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const updateField = level === 'final' ? 'final_verified_by' : 'verified_by';
      const updateTime = level === 'final' ? 'final_verified_at' : 'verified_at';

      await db.query(
        `UPDATE ${schema}.marks 
         SET ${updateField} = $1, ${updateTime} = NOW()
         WHERE exam_schedule_id = $2`,
        [req.user?.id, examScheduleId]
      );

      res.json({ success: true, message: 'Marks verified successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Report Card
  async generateReportCard(req, res, next) {
    try {
      const { branchId, studentId, examId } = req.params;
      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;

      // Get all marks for the exam
      const marksResult = await db.query(
        `SELECT m.*, es.max_marks as schedule_max_marks, s.subject_name
         FROM ${schema}.marks m
         JOIN ${schema}.exam_schedule es ON m.exam_schedule_id = es.id
         JOIN ${schema}.subjects s ON es.subject_id = s.id
         WHERE m.student_id = $1 AND es.exam_id = $2`,
        [studentId, examId]
      );

      const marks = marksResult.rows;
      const totalMarks = marks.reduce((sum, m) => sum + (m.marks_obtained || 0), 0);
      const maxMarks = marks.reduce((sum, m) => sum + (m.schedule_max_marks || 0), 0);
      const percentage = maxMarks > 0 ? (totalMarks / maxMarks * 100).toFixed(2) : 0;

      const id = uuidv4();
      const result = await db.query(
        `INSERT INTO ${schema}.report_cards 
         (id, student_id, exam_id, academic_year, total_marks, max_marks, percentage)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (student_id, exam_id)
         DO UPDATE SET total_marks = $5, max_marks = $6, percentage = $7
         RETURNING *`,
        [id, studentId, examId, '2024-25', totalMarks, maxMarks, percentage]
      );

      res.json({ success: true, data: { ...result.rows[0], subjectMarks: marks } });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExamController();
