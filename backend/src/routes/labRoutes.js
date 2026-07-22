const express = require('express');
const router = express.Router({ mergeParams: true });
const { body } = require('express-validator');
const labController = require('../controllers/labController');
const { validate } = require('../middleware/validators');
const auth = require('../middleware/auth');

router.use(auth);

// Equipment management
router.get('/equipment', labController.getEquipment);
router.post('/equipment', [
  body('name').notEmpty().withMessage('Equipment name is required'),
  body('labType').isIn(['physics', 'chemistry', 'biology', 'computer']).withMessage('Invalid lab type'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be positive'),
  body('condition').isIn(['good', 'fair', 'damaged']).withMessage('Invalid condition'),
  validate
], labController.createEquipment);
router.put('/equipment/:id', labController.updateEquipment);

// Equipment issue
router.post('/issue', [
  body('equipmentId').notEmpty().withMessage('Equipment ID is required'),
  body('issueType').isIn(['individual', 'group']).withMessage('Invalid issue type'),
  body('userId').notEmpty().withMessage('User ID is required'),
  validate
], labController.issueEquipment);
router.put('/return/:issueId', labController.returnEquipment);

// Damage/breakage
router.post('/damage', [
  body('equipmentId').notEmpty().withMessage('Equipment ID is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('fineAmount').isFloat({ min: 0 }).withMessage('Invalid fine amount'),
  validate
], labController.reportDamage);
router.put('/damage/:id/waive', labController.waiveDamageFine);

// Consumables & expiry
router.get('/consumables', labController.getConsumables);
router.post('/consumables', labController.addConsumable);
router.get('/expiring-soon', labController.getExpiringSoon);

module.exports = router;
