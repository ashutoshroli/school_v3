const express = require('express');
const router = express.Router({ mergeParams: true });
const { body } = require('express-validator');
const transportController = require('../controllers/transportController');
const { validate } = require('../middleware/validators');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Vehicle routes
router.get('/vehicles', transportController.getVehicles);
router.get('/vehicles/:id', transportController.getVehicleById);
router.post('/vehicles', [
  body('vehicleNumber').notEmpty().withMessage('Vehicle number is required'),
  body('vehicleType').isIn(['own', 'rented']).withMessage('Invalid vehicle type'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be positive'),
  validate
], transportController.createVehicle);
router.put('/vehicles/:id', transportController.updateVehicle);
router.delete('/vehicles/:id', transportController.deleteVehicle);

// Route management
router.get('/routes', transportController.getRoutes);
router.post('/routes', [
  body('routeName').notEmpty().withMessage('Route name is required'),
  body('stops').isArray().withMessage('Stops must be an array'),
  validate
], transportController.createRoute);
router.put('/routes/:id', transportController.updateRoute);

// GPS tracking
router.get('/vehicles/:id/location', transportController.getVehicleLocation);
router.get('/vehicles/:id/track', transportController.trackVehicle);

// Diesel management
router.get('/diesel-requests', transportController.getDieselRequests);
router.post('/diesel-requests', [
  body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
  body('liters').isFloat({ min: 1 }).withMessage('Liters must be positive'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be positive'),
  validate
], transportController.createDieselRequest);
router.put('/diesel-requests/:id/approve', transportController.approveDieselRequest);
router.put('/diesel-requests/:id/reject', transportController.rejectDieselRequest);

// Driver assignment
router.put('/vehicles/:id/driver', transportController.assignDriver);

// Student transport assignment
router.post('/assign-student', [
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('routeId').notEmpty().withMessage('Route ID is required'),
  body('stopId').notEmpty().withMessage('Stop ID is required'),
  validate
], transportController.assignStudentToRoute);

module.exports = router;
