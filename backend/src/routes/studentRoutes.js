const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const passport = require('../middleware/auth');
const { requireRole, requireBranchAccess } = require('../middleware/rbac');
const { validateBranchAccess } = require('../middleware/validators');

// All routes require authentication
router.use(passport.authenticate('jwt', { session: false }));

// List students
router.get('/',
  requireBranchAccess,
  studentController.list
);

// Create student
router.post('/',
  requireRole('admin', 'director', 'principal', 'front_office'),
  studentController.create
);

// Get student by ID
router.get('/:id',
  requireBranchAccess,
  studentController.getById
);

// Update student
router.put('/:id',
  requireRole('admin', 'director', 'principal'),
  studentController.update
);

// Delete student (archive)
router.delete('/:id',
  requireRole('admin', 'director'),
  studentController.delete
);

// Assign roll number
router.post('/:id/assign-roll-number',
  requireRole('admin', 'director', 'principal'),
  studentController.assignRollNumber
);

module.exports = router;
