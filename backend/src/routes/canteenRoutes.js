const express = require('express');
const router = express.Router({ mergeParams: true });
const { body } = require('express-validator');
const canteenController = require('../controllers/canteenController');
const { validate } = require('../middleware/validators');
const auth = require('../middleware/auth');

router.use(auth);

// Inventory management
router.get('/inventory', canteenController.getInventory);
router.post('/inventory', [
  body('name').notEmpty().withMessage('Item name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Invalid price'),
  body('stock').isInt({ min: 0 }).withMessage('Invalid stock'),
  body('counter').notEmpty().withMessage('Counter is required'),
  validate
], canteenController.addInventoryItem);
router.put('/inventory/:id', canteenController.updateInventory);
router.put('/inventory/:id/stock', canteenController.updateStock);

// Stock replenishment
router.post('/replenish-request', [
  body('items').isArray({ min: 1 }).withMessage('Items array is required'),
  validate
], canteenController.createReplenishRequest);
router.get('/replenish-requests', canteenController.getReplenishRequests);
router.put('/replenish-requests/:id/approve', canteenController.approveReplenishRequest);

// Wallet management (RFID)
router.get('/wallets', canteenController.getWallets);
router.get('/wallets/:userId', canteenController.getWalletBalance);
router.post('/wallets/recharge', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be positive'),
  body('paymentMethod').isIn(['online', 'cash']).withMessage('Invalid payment method'),
  validate
], canteenController.rechargeWallet);
router.post('/wallets/deduct', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be positive'),
  validate
], canteenController.deductFromWallet);

// Counter billing
router.post('/billing', [
  body('items').isArray({ min: 1 }).withMessage('Items are required'),
  body('paymentMethod').isIn(['wallet', 'cash']).withMessage('Invalid payment method'),
  validate
], canteenController.createBill);
router.get('/billing/today', canteenController.getTodaySales);

// Appliance management
router.get('/appliances', canteenController.getAppliances);
router.post('/appliances', canteenController.addAppliance);
router.put('/appliances/:id/maintenance', canteenController.updateApplianceMaintenance);

module.exports = router;
