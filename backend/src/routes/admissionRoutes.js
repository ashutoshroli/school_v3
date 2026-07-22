const express = require('express');
const router = express.Router({ mergeParams: true });
const { body } = require('express-validator');
const admissionController = require('../controllers/admissionController');
const { validate } = require('../middleware/validators');
const auth = require('../middleware/auth');

// Public routes (no auth)
router.post('/enquiry', [
  body('studentName').notEmpty().withMessage('Student name is required'),
  body('parentName').notEmpty().withMessage('Parent name is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('class').notEmpty().withMessage('Class is required'),
  body('branches').isArray({ min: 1 }).withMessage('At least one branch must be selected'),
  validate
], admissionController.submitEnquiry);

router.get('/requirements', admissionController.getRequirements);
router.get('/forms', admissionController.getForms);

// Protected routes
router.use(auth);

// Enquiry management
router.get('/enquiries', admissionController.getEnquiries);
router.put('/enquiries/:id', admissionController.updateEnquiry);

// Application management
router.get('/applications', admissionController.getApplications);
router.post('/applications', [
  body('enquiryId').notEmpty().withMessage('Enquiry ID is required'),
  body('documents').isArray().withMessage('Documents must be an array'),
  validate
], admissionController.createApplication);
router.put('/applications/:id', admissionController.updateApplication);

// Entrance test
router.post('/applications/:id/schedule-test', [
  body('testDate').isISO8601().withMessage('Invalid test date'),
  body('testType').notEmpty().withMessage('Test type is required'),
  validate
], admissionController.scheduleEntranceTest);
router.put('/applications/:id/test-result', [
  body('passed').isBoolean().withMessage('Passed must be boolean'),
  body('score').optional().isFloat({ min: 0, max: 100 }).withMessage('Score must be 0-100'),
  validate
], admissionController.recordTestResult);

// Seat availability check
router.get('/seat-availability', admissionController.checkSeatAvailability);

// Approval (Front Office)
router.put('/applications/:id/approve', admissionController.approveApplication);
router.put('/applications/:id/reject', admissionController.rejectApplication);

// Fee payment for admission
router.post('/applications/:id/pay-admission-fee', [
  body('amount').isFloat({ min: 0 }).withMessage('Invalid amount'),
  body('paymentMethod').isIn(['online', 'cash', 'card']).withMessage('Invalid payment method'),
  validate
], admissionController.payAdmissionFee);

// Confirm admission
router.put('/applications/:id/confirm', admissionController.confirmAdmission);

// Assign class and section
router.put('/applications/:id/assign-class', [
  body('classId').notEmpty().withMessage('Class ID is required'),
  body('sectionId').notEmpty().withMessage('Section ID is required'),
  validate
], admissionController.assignClassSection);

// Roll number assignment (on first attendance)
router.put('/students/:id/assign-roll-number', admissionController.assignRollNumber);

// Special offers (Saraswati Puja discount)
router.get('/special-offers', admissionController.getSpecialOffers);
router.post('/special-offers', admissionController.createSpecialOffer);

module.exports = router;
