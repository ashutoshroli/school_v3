const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class User {
  static async findById(id) {
    const result = await db.query(
      'SELECT * FROM global.users WHERE id = $1 AND is_deleted = FALSE',
      [id]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM global.users WHERE email = $1 AND is_deleted = FALSE',
      [email]
    );
    return result.rows[0];
  }

  static async findByUsername(username) {
    const result = await db.query(
      'SELECT * FROM global.users WHERE username = $1 AND is_deleted = FALSE',
      [username]
    );
    return result.rows[0];
  }

  static async findByGoogleId(googleId) {
    const result = await db.query(
      'SELECT * FROM global.users WHERE google_id = $1 AND is_deleted = FALSE',
      [googleId]
    );
    return result.rows[0];
  }

  static async create(userData) {
    const id = uuidv4();
    const {
      email, username, passwordHash, userRole,
      googleId, googleEmail, primaryBranchId
    } = userData;

    const result = await db.query(
      `INSERT INTO global.users 
       (id, email, username, password_hash, user_role, google_id, google_email, primary_branch_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [id, email, username, passwordHash, userRole, googleId, googleEmail, primaryBranchId]
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
      `UPDATE global.users SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      'UPDATE global.users SET is_deleted = TRUE, deleted_at = NOW() WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  static async updateLoginAttempt(id, attempts, lockedUntil = null) {
    const result = await db.query(
      `UPDATE global.users 
       SET login_attempts = $2, locked_until = $3, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, attempts, lockedUntil]
    );
    return result.rows[0];
  }

  static async resetLoginAttempts(id) {
    const result = await db.query(
      `UPDATE global.users 
       SET login_attempts = 0, locked_until = NULL, last_login = NOW(), updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  static async setPasswordResetToken(id, token, expires) {
    const result = await db.query(
      `UPDATE global.users 
       SET password_reset_token = $2, password_reset_expires = $3, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, token, expires]
    );
    return result.rows[0];
  }

  static async findByPasswordResetToken(token) {
    const result = await db.query(
      'SELECT * FROM global.users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
      [token]
    );
    return result.rows[0];
  }

  static async updatePassword(id, passwordHash) {
    const result = await db.query(
      `UPDATE global.users 
       SET password_hash = $2, password_reset_token = NULL, password_reset_expires = NULL,
           password_changed_at = NOW(), updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, passwordHash]
    );
    return result.rows[0];
  }

  static async setRememberToken(id, token, expires) {
    const result = await db.query(
      `UPDATE global.users 
       SET remember_token = $2, remember_token_expires = $3, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, token, expires]
    );
    return result.rows[0];
  }

  static async findByRememberToken(token) {
    const result = await db.query(
      'SELECT * FROM global.users WHERE remember_token = $1 AND remember_token_expires > NOW() AND is_deleted = FALSE',
      [token]
    );
    return result.rows[0];
  }

  static async getUserBranches(userId) {
    const result = await db.query(
      `SELECT uba.*, b.branch_name, b.branch_code, b.schema_name
       FROM global.user_branch_access uba
       JOIN global.branches b ON uba.branch_id = b.id
       WHERE uba.user_id = $1
       ORDER BY uba.is_primary DESC, b.branch_name`,
      [userId]
    );
    return result.rows;
  }

  static toSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}

module.exports = User;
