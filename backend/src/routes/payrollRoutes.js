const express = require('express');
const router = express.Router({ mergeParams: true });
const { body } = require('express-validator');
const payrollController = require('../controllers/payrollController');
const { validate } = require('../middleware/validators');
const auth = require('../middleware/auth');

router.use(auth);

// Salary structure (branch-wise and role-wise)
router.get('/salary-structures', payrollController.getSalaryStructures);
router.post('/salary-structures', [
  body('role').notEmpty().withMessage('Role is required'),
  body('basic').isFloat({ min: 0 }).withMessage('Invalid basic salary'),
  body('allowances').isObject().withMessage('Allowances must be an object'),
  body('deductions').isObject().withMessage('Deductions must be an object'),
  validate
], payrollController.createSalaryStructure);
router.put('/salary-structures/:id', payrollController.updateSalaryStructure);

// Appraisal ratings
router.get('/ratings', payrollController.getRatings);
router.post('/ratings/student', [
  body('teacherId').notEmpty().withMessage('Teacher ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('feedback').optional().isString(),
  validate
], payrollController.submitStudentRating);
router.post('/ratings/parent', [
  body('teacherId').notEmpty().withMessage('Teacher ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('feedback').optional().isString(),
  validate
], payrollController.submitParentRating);
router.post('/ratings/principal-teacher', [
  body('teacherId').notEmpty().withMessage('Teacher ID is required'),
  body('principalRating').isInt({ min: 1, max: 5 }).withMessage('Principal rating must be 1-5'),
  body('teacherRating').optional().isInt({ min: 1, max: 5 }).withMessage('Teacher rating must be 1-5'),
  validate
], payrollController.submitPrincipalTeacherRating);

// Increment screen (Director enters increment % manually)
router.get('/increment-candidates', payrollController.getIncrementCandidates);
router.put('/staff/:staffId/increment', [
  body('incrementPercent').isFloat({ min: 0, max: 100 }).withMessage('Increment % must be 0-100'),
  validate
], payrollController.applyIncrement);

// Payroll calculation
router.post('/calculate', [
  body('month').isInt({ min: 1, max: 12 }).withMessage('Invalid month'),
  body('year').isInt({ min: 2000 }).withMessage('Invalid year'),
  validate
], payrollController.calculatePayroll);
router.get('/payroll/:month/:year', payrollController.getPayroll);

// Manual salary edit (Admin only)
router.put('/staff/:staffId/salary', [
  body('basic').isFloat({ min: 0 }).withMessage('Invalid basic salary'),
  validate
], payrollController.updateStaffSalary);

// Salary disbursement
router.post('/disburse', [
  body('month').isInt({ min: 1, max: 12 }).withMessage('Invalid month'),
  body('year').isInt({ min: 2000 }).withMessage('Invalid year'),
  body('staffIds').isArray({ min: 1 }).withMessage('Staff IDs are required'),
  validate
], payrollController.disburseSalaries);

module.exports = router;
