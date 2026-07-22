const express = require('express');
const router = express.Router();
const db = require('../config/database');
const jwt = require('jsonwebtoken');

// Middleware to check auth
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// List branches
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM global.branches ORDER BY branch_name'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

// Get branch by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM global.branches WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch branch' });
  }
});

// Create branch
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { branchCode, branchName, city, state, phone, email } = req.body;
    
    // Get next schema number
    const countResult = await db.query(
      "SELECT COUNT(*) + 1 as next_num FROM global.branches"
    );
    const schemaName = `branch_${countResult.rows[0].next_num}`;
    
    const result = await db.query(
      `INSERT INTO global.branches (branch_code, branch_name, schema_name, city, state, phone, email)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [branchCode, branchName, schemaName, city, state, phone, email]
    );
    
    // Create schema
    await db.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create branch' });
  }
});

// Get branch settings
router.get('/:id/settings', authMiddleware, async (req, res) => {
  try {
    const branchResult = await db.query(
      'SELECT schema_name FROM global.branches WHERE id = $1',
      [req.params.id]
    );
    
    if (branchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    
    const schema = branchResult.rows[0].schema_name;
    const result = await db.query(`SELECT * FROM ${schema}.branch_settings LIMIT 1`);
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Get branch stats
router.get('/:id/stats', authMiddleware, async (req, res) => {
  try {
    const branchResult = await db.query(
      'SELECT schema_name FROM global.branches WHERE id = $1',
      [req.params.id]
    );
    
    if (branchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    
    const schema = branchResult.rows[0].schema_name;
    
    const [students, staff, classes] = await Promise.all([
      db.query(`SELECT COUNT(*) as count FROM ${schema}.students WHERE is_deleted = FALSE`),
      db.query(`SELECT COUNT(*) as count FROM ${schema}.staff WHERE is_deleted = FALSE`),
      db.query(`SELECT COUNT(*) as count FROM ${schema}.classes`)
    ]);
    
    res.json({
      success: true,
      data: {
        students: parseInt(students.rows[0].count),
        staff: parseInt(staff.rows[0].count),
        classes: parseInt(classes.rows[0].count)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
