const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const passport = require('../middleware/auth');
const { requireRole, requireBranchAccess } = require('../middleware/rbac');

router.use(passport.authenticate('jwt', { session: false }));

// Student attendance
router.get('/student/:studentId', requireBranchAccess, attendanceController.getStudentAttendance);
router.post('/student', requireRole('teacher', 'admin', 'principal'), attendanceController.markStudentAttendance);
router.post('/student/bulk', requireRole('teacher', 'admin', 'principal'), attendanceController.bulkMarkStudentAttendance);

// Staff attendance
router.get('/staff/:staffId', requireBranchAccess, attendanceController.getStaffAttendance);
router.post('/staff/rfid', attendanceController.recordStaffRFID);

// Summary
router.get('/summary', requireRole('teacher', 'admin', 'principal'), attendanceController.getAttendanceSummary);

module.exports = router;
