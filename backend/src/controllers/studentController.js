const db = require('../config/database');
const Branch = require('../models/Branch');
const { validatePagination } = require('../middleware/validators');
const { v4: uuidv4 } = require('uuid');

class StudentController {
  async list(req, res, next) {
    try {
      const { branchId } = req.params;
      validatePagination(req, res, () => {});

      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const schema = branch.schema_name;
      const { page, limit, offset } = req.pagination;
      const { search, classId, sectionId, status } = req.query;

      let whereClause = 'WHERE is_deleted = FALSE';
      const params = [];

      if (search) {
        whereClause += ` AND (full_name ILIKE $${params.length + 1} OR admission_number ILIKE $${params.length + 1})`;
        params.push(`%${search}%`);
      }

      if (classId) {
        whereClause += ` AND class_id = $${params.length + 1}`;
        params.push(classId);
      }

      if (sectionId) {
        whereClause += ` AND section_id = $${params.length + 1}`;
        params.push(sectionId);
      }

      if (status) {
        whereClause += ` AND status = $${params.length + 1}`;
        params.push(status);
      }

      const countResult = await db.query(
        `SELECT COUNT(*) FROM ${schema}.students ${whereClause}`,
        params
      );

      const result = await db.query(
        `SELECT s.*, c.class_name, sec.section_name
         FROM ${schema}.students s
         LEFT JOIN ${schema}.classes c ON s.class_id = c.id
         LEFT JOIN ${schema}.sections sec ON s.section_id = sec.id
         ${whereClause}
         ORDER BY s.admission_number
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limit, offset]
      );

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          page,
          limit,
          total: parseInt(countResult.rows[0].count),
          totalPages: Math.ceil(countResult.rows[0].count / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { branchId, id } = req.params;

      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const schema = branch.schema_name;
      const result = await db.query(
        `SELECT s.*, c.class_name, sec.section_name
         FROM ${schema}.students s
         LEFT JOIN ${schema}.classes c ON s.class_id = c.id
         LEFT JOIN ${schema}.sections sec ON s.section_id = sec.id
         WHERE s.id = $1 AND s.is_deleted = FALSE`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Get parents
      const parentsResult = await db.query(
        `SELECT p.*, sp.is_primary
         FROM ${schema}.parents p
         JOIN ${schema}.student_parents sp ON p.id = sp.parent_id
         WHERE sp.student_id = $1`,
        [id]
      );

      const student = result.rows[0];
      student.parents = parentsResult.rows;

      res.json({
        success: true,
        data: student
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { branchId } = req.params;
      const studentData = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const schema = branch.schema_name;
      const id = uuidv4();

      // Generate admission number
      const admResult = await db.query(
        `SELECT 'ADM' || to_char(NOW(), 'YYYY') || LPAD((COUNT(*) + 1)::TEXT, 6, '0') as adm_num
         FROM ${schema}.students`
      );
      const admissionNumber = admResult.rows[0].adm_num;

      const result = await db.query(
        `INSERT INTO ${schema}.students 
         (id, admission_number, admission_date, first_name, last_name, email, phone,
          date_of_birth, gender, blood_group, aadhaar_number, address, city, state, pincode,
          class_id, section_id, category, religion, nationality, mother_tongue, status, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
         RETURNING *`,
        [id, admissionNumber, studentData.admissionDate || new Date(),
         studentData.firstName, studentData.lastName, studentData.email,
         studentData.phone, studentData.dateOfBirth, studentData.gender,
         studentData.bloodGroup, studentData.aadhaarNumber, studentData.address,
         studentData.city, studentData.state, studentData.pincode,
         studentData.classId, studentData.sectionId, studentData.category,
         studentData.religion, studentData.nationality || 'Indian',
         studentData.motherTongue, 'active', req.user?.id]
      );

      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { branchId, id } = req.params;
      const updates = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const schema = branch.schema_name;
      const fields = [];
      const values = [];
      let paramCount = 2;

      const fieldMapping = {
        firstName: 'first_name',
        lastName: 'last_name',
        email: 'email',
        phone: 'phone',
        address: 'address',
        city: 'city',
        state: 'state',
        pincode: 'pincode',
        classId: 'class_id',
        sectionId: 'section_id',
        status: 'status'
      };

      Object.entries(updates).forEach(([key, value]) => {
        if (fieldMapping[key] && value !== undefined) {
          fields.push(`${fieldMapping[key]} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      const result = await db.query(
        `UPDATE ${schema}.students 
         SET ${fields.join(', ')}, updated_at = NOW()
         WHERE id = $1 AND is_deleted = FALSE
         RETURNING *`,
        [id, ...values]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.json({
        success: true,
        message: 'Student updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { branchId, id } = req.params;

      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const schema = branch.schema_name;
      const result = await db.query(
        `UPDATE ${schema}.students 
         SET is_deleted = TRUE, deleted_at = NOW()
         WHERE id = $1 AND is_deleted = FALSE
         RETURNING id`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.json({
        success: true,
        message: 'Student archived successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async assignRollNumber(req, res, next) {
    try {
      const { branchId, id } = req.params;

      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const schema = branch.schema_name;

      // Get student
      const studentResult = await db.query(
        `SELECT * FROM ${schema}.students WHERE id = $1 AND is_deleted = FALSE`,
        [id]
      );

      if (studentResult.rows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const student = studentResult.rows[0];

      // Get next roll number for class-section
      const rollResult = await db.query(
        `SELECT COALESCE(MAX(CAST(roll_number AS INTEGER)), 0) + 1 as next_roll
         FROM ${schema}.students 
         WHERE class_id = $1 AND section_id = $2 AND roll_number IS NOT NULL`,
        [student.class_id, student.section_id]
      );

      const rollNumber = rollResult.rows[0].next_roll.toString();

      // Update student
      const result = await db.query(
        `UPDATE ${schema}.students 
         SET roll_number = $1, roll_number_assigned_date = $2, updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [rollNumber, new Date(), id]
      );

      res.json({
        success: true,
        message: 'Roll number assigned successfully',
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentController();
