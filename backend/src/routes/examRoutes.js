const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const passport = require('../middleware/auth');
const { requireRole, requireBranchAccess } = require('../middleware/rbac');

router.use(passport.authenticate('jwt', { session: false }));

// Exam types
router.get('/types', requireBranchAccess, examController.listExamTypes);

// Exams
router.get('/', requireBranchAccess, examController.listExams);
router.post('/', requireRole('principal', 'admin'), examController.createExam);
router.put('/:examId/status', requireRole('principal', 'admin'), examController.updateExamStatus);

// Exam Schedule
router.get('/:examId/schedule', requireBranchAccess, examController.getExamSchedule);
router.post('/schedule', requireRole('principal', 'admin'), examController.addExamSchedule);

// Marks
router.get('/schedule/:examScheduleId/marks', requireRole('teacher', 'principal', 'admin'), examController.getMarks);
router.post('/marks', requireRole('teacher', 'admin'), examController.enterMarks);
router.post('/schedule/:examScheduleId/verify', requireRole('principal', 'admin'), examController.verifyMarks);

// Report Card
router.get('/:examId/report/:studentId', requireBranchAccess, examController.generateReportCard);

module.exports = router;
