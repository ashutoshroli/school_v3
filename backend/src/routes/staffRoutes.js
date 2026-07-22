const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const passport = require('../middleware/auth');
const { requireRole, requireBranchAccess } = require('../middleware/rbac');

router.use(passport.authenticate('jwt', { session: false }));

router.get('/', requireBranchAccess, staffController.list);
router.post('/', requireRole('admin', 'director', 'principal'), staffController.create);
router.get('/:id', requireBranchAccess, staffController.getById);
router.put('/:id', requireRole('admin', 'director', 'principal'), staffController.update);
router.delete('/:id', requireRole('admin', 'director'), staffController.delete);

module.exports = router;
