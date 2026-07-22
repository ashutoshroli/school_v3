const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const passport = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.use(passport.authenticate('jwt', { session: false }));

// Super Admin Dashboard
router.get('/super-admin', requireRole('super_admin'), dashboardController.getSuperAdminDashboard);

// Branch Dashboard
router.get('/', dashboardController.getBranchDashboard);

// Role-specific dashboards
router.get('/teacher/:staffId', requireRole('teacher', 'admin', 'principal'), dashboardController.getTeacherDashboard);
router.get('/student/:studentId', dashboardController.getStudentDashboard);
router.get('/parent/:parentId', dashboardController.getParentDashboard);

module.exports = router;
