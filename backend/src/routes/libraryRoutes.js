const express = require('express');
const router = express.Router({ mergeParams: true });
const { body } = require('express-validator');
const libraryController = require('../controllers/libraryController');
const { validate } = require('../middleware/validators');
const auth = require('../middleware/auth');

router.use(auth);

// Book management
router.get('/books', libraryController.getBooks);
router.get('/books/:id', libraryController.getBookById);
router.post('/books', [
  body('title').notEmpty().withMessage('Title is required'),
  body('isbn').notEmpty().withMessage('ISBN is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('purchaseRate').isFloat({ min: 0 }).withMessage('Invalid purchase rate'),
  body('currentRate').isFloat({ min: 0 }).withMessage('Invalid current rate'),
  body('rackLocation').notEmpty().withMessage('Rack location is required'),
  validate
], libraryController.createBook);
router.put('/books/:id', libraryController.updateBook);

// Book issue/return
router.post('/issue', [
  body('bookId').notEmpty().withMessage('Book ID is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
  body('userType').isIn(['student', 'staff']).withMessage('Invalid user type'),
  validate
], libraryController.issueBook);
router.put('/return/:issueId', libraryController.returnBook);
router.get('/issued', libraryController.getIssuedBooks);
router.get('/overdue', libraryController.getOverdueBooks);

// Fine management
router.get('/fines', libraryController.getFines);
router.put('/fines/:id/waive', libraryController.waiveFine);
router.put('/fines/:id/pay', libraryController.payFine);

// Reports
router.get('/reports/inventory', libraryController.inventoryReport);
router.get('/reports/overdue', libraryController.overdueReport);

module.exports = router;
