const express = require('express');
const router = express.Router({ mergeParams: true });
const { body } = require('express-validator');
const timetableController = require('../controllers/timetableController');
const { validate } = require('../middleware/validators');
const auth = require('../middleware/auth');

router.use(auth);

// Class timetable
router.get('/class/:classId', timetableController.getClassTimetable);
router.post('/class/:classId', [
  body('periods').isArray({ min: 1 }).withMessage('Periods are required'),
  body('clashDetectionMode').optional().isIn(['warning', 'block']).withMessage('Invalid clash mode'),
  validate
], timetableController.createClassTimetable);
router.put('/class/:classId', timetableController.updateClassTimetable);
router.delete('/class/:classId', timetableController.deleteClassTimetable);

// Clash detection
router.post('/check-clash', [
  body('teacherId').notEmpty().withMessage('Teacher ID is required'),
  body('roomId').notEmpty().withMessage('Room ID is required'),
  body('day').notEmpty().withMessage('Day is required'),
  body('period').isInt({ min: 1 }).withMessage('Period must be positive'),
  validate
], timetableController.checkClash);

// Substitute assignment
router.post('/substitute', [
  body('leaveId').notEmpty().withMessage('Leave ID is required'),
  body('periods').isArray({ min: 1 }).withMessage('Periods are required'),
  validate
], timetableController.assignSubstitute);
router.get('/substitute-suggestions', timetableController.getSubstituteSuggestions);

// Exam timetable
router.get('/exam/:examId', timetableController.getExamTimetable);
router.post('/exam/:examId', [
  body('schedule').isArray({ min: 1 }).withMessage('Schedule is required'),
  validate
], timetableController.createExamTimetable);
router.put('/exam/:examId', timetableController.updateExamTimetable);

// Invigilator clash check
router.post('/exam/check-invigilator-clash', [
  body('teacherId').notEmpty().withMessage('Teacher ID is required'),
  body('date').isISO8601().withMessage('Invalid date'),
  body('time').notEmpty().withMessage('Time is required'),
  validate
], timetableController.checkInvigilatorClash);

// Period configuration
router.get('/periods', timetableController.getPeriods);
router.post('/periods', timetableController.createPeriods);
router.put('/periods', timetableController.updatePeriods);

// Branch settings for timetable
router.get('/settings', timetableController.getTimetableSettings);
router.put('/settings', timetableController.updateTimetableSettings);

module.exports = router;
