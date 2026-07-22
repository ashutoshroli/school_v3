const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const passport = require('../middleware/auth');
const { requireRole, requireBranchAccess } = require('../middleware/rbac');

router.use(passport.authenticate('jwt', { session: false }));

// Leave types
router.get('/types', requireBranchAccess, leaveController.listLeaveTypes);

// Leave balance
router.get('/balance/:staffId', requireBranchAccess, leaveController.getLeaveBalance);

// Leave requests
router.get('/', requireBranchAccess, leaveController.listLeaveRequests);
router.post('/', requireRole('staff', 'teacher', 'admin', 'principal', 'vp'), leaveController.applyLeave);
router.post('/:leaveId/approve', requireRole('vp', 'principal', 'director'), leaveController.approveLeave);

module.exports = router;
