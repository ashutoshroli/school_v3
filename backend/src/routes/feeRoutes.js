const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const passport = require('../middleware/auth');
const { requireRole, requireBranchAccess } = require('../middleware/rbac');

router.use(passport.authenticate('jwt', { session: false }));

// Categories
router.get('/categories', requireBranchAccess, feeController.listCategories);
router.post('/categories', requireRole('admin', 'director', 'principal'), feeController.createCategory);

// Fee Structure
router.get('/structure/:classId', requireRole('admin', 'director', 'principal', 'accountant'), feeController.getFeeStructure);
router.post('/structure', requireRole('admin', 'director', 'principal'), feeController.setFeeStructure);

// Student Fees
router.get('/student/:studentId', requireBranchAccess, feeController.getStudentFees);
router.post('/student', requireRole('admin', 'director', 'principal', 'accountant'), feeController.assignFee);

// Payments
router.get('/payments/:studentId', requireBranchAccess, feeController.getPaymentHistory);
router.post('/payments', requireRole('admin', 'accountant', 'front_office'), feeController.recordPayment);

// Waivers
router.post('/waiver', requireRole('principal', 'admin'), feeController.requestWaiver);

module.exports = router;
