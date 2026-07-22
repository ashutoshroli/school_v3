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

// Import route modules - Core
const authRoutes = require('./authRoutes');
const branchRoutes = require('./branchRoutes');
const studentRoutes = require('./studentRoutes');
const staffRoutes = require('./staffRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const feeRoutes = require('./feeRoutes');
const leaveRoutes = require('./leaveRoutes');
const examRoutes = require('./examRoutes');
const dashboardRoutes = require('./dashboardRoutes');

// Import route modules - Extended
const transportRoutes = require('./transportRoutes');
const roomRoutes = require('./roomRoutes');
const timetableRoutes = require('./timetableRoutes');
const payrollRoutes = require('./payrollRoutes');
const homeworkRoutes = require('./homeworkRoutes');
const libraryRoutes = require('./libraryRoutes');
const hostelRoutes = require('./hostelRoutes');
const messRoutes = require('./messRoutes');
const canteenRoutes = require('./canteenRoutes');
const labRoutes = require('./labRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const admissionRoutes = require('./admissionRoutes');

// Mount core routes
router.use('/auth', authRoutes);
router.use('/branches', branchRoutes);
router.use('/branches/:branchId/students', studentRoutes);
router.use('/branches/:branchId/staff', staffRoutes);
router.use('/branches/:branchId/attendance', attendanceRoutes);
router.use('/branches/:branchId/fees', feeRoutes);
router.use('/branches/:branchId/leaves', leaveRoutes);
router.use('/branches/:branchId/exams', examRoutes);
router.use('/branches/:branchId/dashboard', dashboardRoutes);

// Mount extended routes
router.use('/branches/:branchId/transport', transportRoutes);
router.use('/branches/:branchId/rooms', roomRoutes);
router.use('/branches/:branchId/timetable', timetableRoutes);
router.use('/branches/:branchId/payroll', payrollRoutes);
router.use('/branches/:branchId/homework', homeworkRoutes);
router.use('/branches/:branchId/library', libraryRoutes);
router.use('/branches/:branchId/hostel', hostelRoutes);
router.use('/branches/:branchId/mess', messRoutes);
router.use('/branches/:branchId/canteen', canteenRoutes);
router.use('/branches/:branchId/lab', labRoutes);
router.use('/branches/:branchId/inventory', inventoryRoutes);
router.use('/branches/:branchId/admission', admissionRoutes);

module.exports = router;
