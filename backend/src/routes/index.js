const express = require('express');
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API version info
router.get('/', (req, res) => {
  res.json({
    name: 'School ERP API',
    version: '1.0.0',
    description: 'Multi-Branch School Management ERP API'
  });
});

// Import route modules
const authRoutes = require('./authRoutes');
const branchRoutes = require('./branchRoutes');
const studentRoutes = require('./studentRoutes');
const staffRoutes = require('./staffRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const feeRoutes = require('./feeRoutes');
const leaveRoutes = require('./leaveRoutes');
const examRoutes = require('./examRoutes');
const dashboardRoutes = require('./dashboardRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/branches', branchRoutes);
router.use('/branches/:branchId/students', studentRoutes);
router.use('/branches/:branchId/staff', staffRoutes);
router.use('/branches/:branchId/attendance', attendanceRoutes);
router.use('/branches/:branchId/fees', feeRoutes);
router.use('/branches/:branchId/leaves', leaveRoutes);
router.use('/branches/:branchId/exams', examRoutes);
router.use('/branches/:branchId/dashboard', dashboardRoutes);

module.exports = router;
