const express = require('express');
const router = express.Router({ mergeParams: true });
const { body } = require('express-validator');
const homeworkController = require('../controllers/homeworkController');
const { validate } = require('../middleware/validators');
const auth = require('../middleware/auth');

router.use(auth);

// Homework assignment
router.get('/', homeworkController.getHomeworks);
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('subjectId').notEmpty().withMessage('Subject is required'),
  body('classId').notEmpty().withMessage('Class is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('dueDate').isISO8601().withMessage('Invalid due date'),
  validate
], homeworkController.createHomework);
router.put('/:id', homeworkController.updateHomework);
router.delete('/:id', homeworkController.deleteHomework);

// Submission management
router.get('/:id/submissions', homeworkController.getSubmissions);
router.post('/:id/submit', [
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('attachment').optional().isURL().withMessage('Invalid attachment URL'),
  validate
], homeworkController.submitHomework);
router.put('/submissions/:submissionId', homeworkController.updateSubmission);

// Grading (Subject Teacher only, after deadline)
router.put('/submissions/:submissionId/grade', [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('remarks').optional().isString(),
  validate
], homeworkController.gradeSubmission);

// Recheck request flow
router.post('/submissions/:submissionId/recheck-request', [
  body('reason').notEmpty().withMessage('Reason is required'),
  validate
], homeworkController.requestRecheck);
router.get('/recheck-requests', homeworkController.getRecheckRequests);
router.put('/recheck-requests/:id/respond', homeworkController.respondToRecheck);

// Parent view
router.get('/student/:studentId', homeworkController.getStudentHomeworks);

module.exports = router;
