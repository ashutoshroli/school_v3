const express = require('express');
const router = express.Router({ mergeParams: true });
const { body } = require('express-validator');
const hostelController = require('../controllers/hostelController');
const { validate } = require('../middleware/validators');
const auth = require('../middleware/auth');

router.use(auth);

// Room management
router.get('/rooms', hostelController.getRooms);
router.post('/rooms', [
  body('roomNumber').notEmpty().withMessage('Room number is required'),
  body('roomType').isIn(['single', 'double', 'triple', 'custom']).withMessage('Invalid room type'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be positive'),
  validate
], hostelController.createRoom);
router.put('/rooms/:id', hostelController.updateRoom);

// Bed allotment
router.get('/allotments', hostelController.getAllotments);
router.post('/allotments/request', [
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('roomType').notEmpty().withMessage('Room type is required'),
  validate
], hostelController.requestAllotment);
router.put('/allotments/:id/approve', hostelController.approveAllotment);
router.put('/allotments/:id/reject', hostelController.rejectAllotment);
router.put('/allotments/:id/roommate-approve', hostelController.roommateApprove);

// RFID attendance for hostel
router.post('/attendance/tap', [
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('type').isIn(['in', 'out']).withMessage('Type must be in or out'),
  body('timestamp').isISO8601().withMessage('Invalid timestamp'),
  validate
], hostelController.recordAttendance);
router.get('/attendance/:date', hostelController.getAttendance);

// Fee for hostel
router.get('/fees', hostelController.getHostelFees);
router.post('/fees/waive', hostelController.waiveHostelFee);

module.exports = router;
