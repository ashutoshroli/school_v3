const express = require('express');
const router = express.Router({ mergeParams: true });
const { body } = require('express-validator');
const inventoryController = require('../controllers/inventoryController');
const { validate } = require('../middleware/validators');
const auth = require('../middleware/auth');

router.use(auth);

// Item management
router.get('/items', inventoryController.getItems);
router.post('/items', [
  body('name').notEmpty().withMessage('Item name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Invalid quantity'),
  body('location').notEmpty().withMessage('Location is required'),
  validate
], inventoryController.createItem);
router.put('/items/:id', inventoryController.updateItem);

// Stock management
router.get('/low-stock', inventoryController.getLowStockItems);
router.put('/items/:id/stock', inventoryController.updateStock);

// Purchase/reorder
router.post('/purchase-request', [
  body('items').isArray({ min: 1 }).withMessage('Items array is required'),
  validate
], inventoryController.createPurchaseRequest);
router.get('/purchase-requests', inventoryController.getPurchaseRequests);
router.put('/purchase-requests/:id/approve', inventoryController.approvePurchaseRequest);
router.put('/purchase-requests/:id/reject', inventoryController.rejectPurchaseRequest);

// Item issue to department/staff
router.post('/issue', [
  body('itemId').notEmpty().withMessage('Item ID is required'),
  body('issuedTo').notEmpty().withMessage('Issued to is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be positive'),
  body('isReturnable').isBoolean().withMessage('isReturnable must be boolean'),
  validate
], inventoryController.issueItem);
router.put('/return/:issueId', inventoryController.returnItem);
router.get('/issued', inventoryController.getIssuedItems);

// Damage/loss
router.post('/damage', [
  body('itemId').notEmpty().withMessage('Item ID is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('fineAmount').isFloat({ min: 0 }).withMessage('Invalid fine amount'),
  validate
], inventoryController.reportDamage);
router.put('/damage/:id/waive', inventoryController.waiveDamageFine);

module.exports = router;
