const express = require('express');
const router = express.Router({ mergeParams: true });
const { body } = require('express-validator');
const roomController = require('../controllers/roomController');
const { validate } = require('../middleware/validators');
const auth = require('../middleware/auth');

router.use(auth);

// Building management
router.get('/buildings', roomController.getBuildings);
router.post('/buildings', [
  body('buildingCode').notEmpty().withMessage('Building code is required'),
  body('buildingName').notEmpty().withMessage('Building name is required'),
  body('totalFloors').isInt({ min: 1 }).withMessage('Total floors must be positive'),
  validate
], roomController.createBuilding);
router.put('/buildings/:id', roomController.updateBuilding);
router.delete('/buildings/:id', roomController.deleteBuilding);

// Floor management
router.get('/buildings/:buildingId/floors', roomController.getFloors);
router.post('/buildings/:buildingId/floors', roomController.createFloor);

// Room management
router.get('/rooms', roomController.getRooms);
router.get('/rooms/:id', roomController.getRoomById);
router.post('/rooms', [
  body('roomCode').notEmpty().withMessage('Room code is required'),
  body('roomType').isIn(['classroom', 'lab_physics', 'lab_chemistry', 'lab_biology', 'lab_computer', 
    'library', 'principal_chamber', 'vp_chamber', 'teachers_chamber', 'hod_office', 
    'admin_office', 'accounts', 'reception', 'auditorium', 'sports_room', 
    'medical_room', 'store_room', 'server_room', 'cafeteria', 'conference_room', 
    'washroom', 'transport_office']).withMessage('Invalid room type'),
  body('capacity').isInt({ min: 0 }).withMessage('Invalid capacity'),
  validate
], roomController.createRoom);
router.put('/rooms/:id', roomController.updateRoom);
router.delete('/rooms/:id', roomController.deleteRoom);

// Room booking (for shared rooms)
router.get('/bookings', roomController.getBookings);
router.post('/bookings', [
  body('roomId').notEmpty().withMessage('Room ID is required'),
  body('date').isISO8601().withMessage('Invalid date'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required'),
  body('purpose').notEmpty().withMessage('Purpose is required'),
  validate
], roomController.createBooking);
router.put('/bookings/:id/approve', roomController.approveBooking);
router.put('/bookings/:id/reject', roomController.rejectBooking);

// Cabin management (for Teachers' Chamber)
router.get('/rooms/:roomId/cabins', roomController.getCabins);
router.post('/rooms/:roomId/cabins', [
  body('cabinNumber').notEmpty().withMessage('Cabin number is required'),
  validate
], roomController.createCabin);
router.put('/cabins/:id/assign', roomController.assignCabin);

// Room occupancy
router.get('/rooms/:id/occupancy', roomController.getRoomOccupancy);
router.put('/rooms/:id/occupancy', roomController.updateOccupancy);

module.exports = router;
