const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const passport = require('../middleware/auth');
const { requireRole, canDelete } = require('../middleware/rbac');

// All routes require authentication
router.use(passport.authenticate('jwt', { session: false }));

// List all branches
router.get('/',
  requireRole('admin', 'director', 'principal'),
  branchController.list
);

// Create new branch
router.post('/',
  requireRole('admin', 'director'),
  branchController.create
);

// Get branch by ID
router.get('/:id',
  requireRole('admin', 'director', 'principal'),
  branchController.getById
);

// Update branch
router.put('/:id',
  requireRole('admin', 'director'),
  branchController.update
);

// Delete branch (Super Admin only)
router.delete('/:id',
  canDelete,
  branchController.delete
);

// Branch settings
router.get('/:id/settings',
  requireRole('admin', 'director', 'principal'),
  branchController.getSettings
);

router.put('/:id/settings',
  requireRole('admin', 'director', 'principal'),
  branchController.updateSettings
);

// Branch stats
router.get('/:id/stats',
  requireRole('admin', 'director', 'principal'),
  branchController.getStats
);

module.exports = router;
