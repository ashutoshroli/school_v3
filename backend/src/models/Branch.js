const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Branch {
  static async findAll() {
    const result = await db.query(
      'SELECT * FROM global.branches ORDER BY branch_name'
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      'SELECT * FROM global.branches WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByCode(branchCode) {
    const result = await db.query(
      'SELECT * FROM global.branches WHERE branch_code = $1',
      [branchCode]
    );
    return result.rows[0];
  }

  static async findBySchemaName(schemaName) {
    const result = await db.query(
      'SELECT * FROM global.branches WHERE schema_name = $1',
      [schemaName]
    );
    return result.rows[0];
  }

  static async create(branchData) {
    const id = uuidv4();
    const {
      branchCode, branchName, address, city, state, pincode,
      phone, email, website, maxStudents, maxStaff, affiliationNumber, board
    } = branchData;

    // Get next branch number
    const countResult = await db.query(
      "SELECT COALESCE(MAX(CAST(REPLACE(schema_name, 'branch_', '') AS INTEGER)), 0) + 1 as next_num FROM global.branches"
    );
    const nextNum = countResult.rows[0].next_num;
    const schemaName = `branch_${nextNum}`;

    const result = await db.query(
      `INSERT INTO global.branches 
       (id, branch_code, branch_name, schema_name, address, city, state, pincode, 
        phone, email, website, max_students, max_staff, affiliation_number, board)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [id, branchCode, branchName, schemaName, address, city, state, pincode,
       phone, email, website, maxStudents, maxStaff, affiliationNumber, board]
    );

    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [id];
    let paramCount = 2;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${this.toSnakeCase(key)} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    const result = await db.query(
      `UPDATE global.branches SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async softDelete(id) {
    const result = await db.query(
      "UPDATE global.branches SET status = 'archived', updated_at = NOW() WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows[0];
  }

  static async getBranchSettings(schemaName) {
    const result = await db.query(
      `SELECT * FROM ${schemaName}.branch_settings LIMIT 1`
    );
    return result.rows[0];
  }

  static async getBranchStats(schemaName) {
    const stats = {};
    
    const studentCount = await db.query(
      `SELECT COUNT(*) as count FROM ${schemaName}.students WHERE is_deleted = FALSE AND status = 'active'`
    );
    stats.students = parseInt(studentCount.rows[0].count);

    const staffCount = await db.query(
      `SELECT COUNT(*) as count FROM ${schemaName}.staff WHERE is_deleted = FALSE AND status = 'active'`
    );
    stats.staff = parseInt(staffCount.rows[0].count);

    const classCount = await db.query(
      `SELECT COUNT(*) as count FROM ${schemaName}.classes`
    );
    stats.classes = parseInt(classCount.rows[0].count);

    return stats;
  }

  static async createSchema(schemaName) {
    await db.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
  }

  static async cloneTemplateToSchema(schemaName) {
    // This would typically be done via a SQL file
    // For now, return the schema name for reference
    return schemaName;
  }

  static toSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}

module.exports = Branch;
