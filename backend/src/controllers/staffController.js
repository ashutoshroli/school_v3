const db = require('../config/database');
const Branch = require('../models/Branch');
const { validatePagination } = require('../middleware/validators');
const { v4: uuidv4 } = require('uuid');

class StaffController {
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
      const { search, departmentId, role, status } = req.query;

      let whereClause = 'WHERE is_deleted = FALSE';
      const params = [];

      if (search) {
        whereClause += ` AND (full_name ILIKE $${params.length + 1} OR employee_id ILIKE $${params.length + 1})`;
        params.push(`%${search}%`);
      }

      if (departmentId) {
        whereClause += ` AND department_id = $${params.length + 1}`;
        params.push(departmentId);
      }

      if (role) {
        whereClause += ` AND role = $${params.length + 1}`;
        params.push(role);
      }

      if (status) {
        whereClause += ` AND status = $${params.length + 1}`;
        params.push(status);
      }

      const countResult = await db.query(
        `SELECT COUNT(*) FROM ${schema}.staff ${whereClause}`,
        params
      );

      const result = await db.query(
        `SELECT s.*, d.department_name
         FROM ${schema}.staff s
         LEFT JOIN ${schema}.departments d ON s.department_id = d.id
         ${whereClause}
         ORDER BY s.employee_id
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
        `SELECT s.*, d.department_name
         FROM ${schema}.staff s
         LEFT JOIN ${schema}.departments d ON s.department_id = d.id
         WHERE s.id = $1 AND s.is_deleted = FALSE`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Staff not found' });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { branchId } = req.params;
      const staffData = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const schema = branch.schema_name;
      const id = uuidv4();

      // Generate employee ID
      const empResult = await db.query(
        `SELECT 'EMP' || LPAD((COUNT(*) + 1)::TEXT, 5, '0') as emp_id
         FROM ${schema}.staff`
      );
      const employeeId = empResult.rows[0].emp_id;

      const result = await db.query(
        `INSERT INTO ${schema}.staff 
         (id, employee_id, first_name, last_name, email, phone, date_of_birth, gender,
          blood_group, aadhaar_number, pan_number, address, city, state, pincode,
          designation, department_id, employment_type, joining_date, role, status, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
         RETURNING *`,
        [id, employeeId, staffData.firstName, staffData.lastName, staffData.email,
         staffData.phone, staffData.dateOfBirth, staffData.gender, staffData.bloodGroup,
         staffData.aadhaarNumber, staffData.panNumber, staffData.address,
         staffData.city, staffData.state, staffData.pincode, staffData.designation,
         staffData.departmentId, staffData.employmentType, staffData.joiningDate,
         staffData.role || 'staff', 'active', req.user?.id]
      );

      res.status(201).json({
        success: true,
        message: 'Staff created successfully',
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
      const values = [id];
      let paramCount = 2;

      const fieldMapping = {
        firstName: 'first_name',
        lastName: 'last_name',
        email: 'email',
        phone: 'phone',
        designation: 'designation',
        departmentId: 'department_id',
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
        `UPDATE ${schema}.staff 
         SET ${fields.join(', ')}, updated_at = NOW()
         WHERE id = $1 AND is_deleted = FALSE
         RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Staff not found' });
      }

      res.json({
        success: true,
        message: 'Staff updated successfully',
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
        `UPDATE ${schema}.staff 
         SET is_deleted = TRUE, deleted_at = NOW()
         WHERE id = $1 AND is_deleted = FALSE
         RETURNING id`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Staff not found' });
      }

      res.json({
        success: true,
        message: 'Staff archived successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StaffController();
