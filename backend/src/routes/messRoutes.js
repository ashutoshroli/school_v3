const express = require('express');
const router = express.Router({ mergeParams: true });
const { body } = require('express-validator');
const messController = require('../controllers/messController');
const { validate } = require('../middleware/validators');
const auth = require('../middleware/auth');

router.use(auth);

// Menu management
router.get('/menu', messController.getMenu);
router.post('/menu', [
  body('week').isInt({ min: 1, max: 52 }).withMessage('Invalid week number'),
  body('days').isArray({ min: 1 }).withMessage('Days array is required'),
  validate
], messController.createMenu);
router.put('/menu/:id', messController.updateMenu);
router.post('/menu/:id/submit-approval', messController.submitMenuApproval);
router.put('/menu/:id/approve', messController.approveMenu);

// Subscriber management
router.get('/subscribers', messController.getSubscribers);
router.post('/subscribe', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('plan').notEmpty().withMessage('Plan is required'),
  validate
], messController.subscribeUser);
router.put('/unsubscribe/:id', messController.unsubscribeUser);

// Billing
router.get('/billing', messController.getBilling);
router.post('/billing/generate', messController.generateMonthlyBill);
router.put('/billing/:id/waive', messController.waiveBill);

// Guest meals
router.post('/guest-meal', [
  body('date').isISO8601().withMessage('Invalid date'),
  body('mealType').isIn(['breakfast', 'lunch', 'dinner']).withMessage('Invalid meal type'),
  body('guestName').notEmpty().withMessage('Guest name is required'),
  body('isParent').isBoolean().withMessage('isParent must be boolean'),
  validate
], messController.recordGuestMeal);
router.get('/guest-meals', messController.getGuestMeals);

module.exports = router;
