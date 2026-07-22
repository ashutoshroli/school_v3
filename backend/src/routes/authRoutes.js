const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Login Super Admin
router.post('/login/super-admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const result = await db.query(
      'SELECT * FROM global.super_admins WHERE username = $1 OR email = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = result.rows[0];

    if (!admin.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await db.query(
      'UPDATE global.super_admins SET last_login = NOW() WHERE id = $1',
      [admin.id]
    );

    // Generate token
    const token = jwt.sign(
      { id: admin.id, role: 'super_admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: admin.id,
          email: admin.email,
          username: admin.username,
          fullName: admin.full_name,
          role: 'super_admin',
          isSuperAdmin: true
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const result = await db.query(
      'SELECT * FROM global.users WHERE username = $1 OR email = $1 AND is_deleted = FALSE',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get branch access
    const branchResult = await db.query(
      `SELECT uba.*, b.branch_name, b.schema_name 
       FROM global.user_branch_access uba
       JOIN global.branches b ON uba.branch_id = b.id
       WHERE uba.user_id = $1`,
      [user.id]
    );

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.user_role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.user_role,
          primaryBranchId: user.primary_branch_id,
          branchAccess: branchResult.rows
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get Profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (decoded.role === 'super_admin') {
      const result = await db.query(
        'SELECT id, email, username, full_name FROM global.super_admins WHERE id = $1',
        [decoded.id]
      );
      return res.json({ success: true, data: { ...result.rows[0], isSuperAdmin: true } });
    }

    const result = await db.query(
      'SELECT id, email, username, user_role FROM global.users WHERE id = $1',
      [decoded.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
