const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class SuperAdmin {
  static async findById(id) {
    const result = await db.query(
      'SELECT * FROM global.super_admins WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM global.super_admins WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findByUsername(username) {
    const result = await db.query(
      'SELECT * FROM global.super_admins WHERE username = $1',
      [username]
    );
    return result.rows[0];
  }

  static async findByGoogleId(googleId) {
    const result = await db.query(
      'SELECT * FROM global.super_admins WHERE google_id = $1',
      [googleId]
    );
    return result.rows[0];
  }

  static async create(adminData) {
    const id = uuidv4();
    const { email, username, passwordHash, fullName, phone } = adminData;

    const result = await db.query(
      `INSERT INTO global.super_admins 
       (id, email, username, password_hash, full_name, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, email, username, passwordHash, fullName, phone]
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
      `UPDATE global.super_admins SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async updateLoginAttempt(id, attempts, lockedUntil = null) {
    const result = await db.query(
      `UPDATE global.super_admins 
       SET login_attempts = $2, locked_until = $3, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, attempts, lockedUntil]
    );
    return result.rows[0];
  }

  static async resetLoginAttempts(id) {
    const result = await db.query(
      `UPDATE global.super_admins 
       SET login_attempts = 0, locked_until = NULL, last_login = NOW(), updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  static toSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}

module.exports = SuperAdmin;
