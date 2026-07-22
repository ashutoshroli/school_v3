const roomService = require('../services/roomService');

const roomController = {
  getBuildings: async (req, res) => {
    try {
      const buildings = await roomService.getBuildings(req.params.branchId);
      res.json({ success: true, data: buildings });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createBuilding: async (req, res) => {
    try {
      const building = await roomService.createBuilding(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: building });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateBuilding: async (req, res) => {
    try {
      const building = await roomService.updateBuilding(req.params.id, req.body);
      res.json({ success: true, data: building });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteBuilding: async (req, res) => {
    try {
      await roomService.deleteBuilding(req.params.id);
      res.json({ success: true, message: 'Building deleted' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getFloors: async (req, res) => {
    try {
      const floors = await roomService.getFloors(req.params.buildingId);
      res.json({ success: true, data: floors });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createFloor: async (req, res) => {
    try {
      const floor = await roomService.createFloor(req.params.buildingId, req.body);
      res.status(201).json({ success: true, data: floor });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getRooms: async (req, res) => {
    try {
      const rooms = await roomService.getRooms(req.params.branchId, req.query);
      res.json({ success: true, data: rooms });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getRoomById: async (req, res) => {
    try {
      const room = await roomService.getRoomById(req.params.id);
      if (!room) return res.status(404).json({ success: false, error: 'Room not found' });
      res.json({ success: true, data: room });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createRoom: async (req, res) => {
    try {
      const room = await roomService.createRoom(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: room });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateRoom: async (req, res) => {
    try {
      const room = await roomService.updateRoom(req.params.id, req.body);
      res.json({ success: true, data: room });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteRoom: async (req, res) => {
    try {
      await roomService.deleteRoom(req.params.id);
      res.json({ success: true, message: 'Room deleted' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getBookings: async (req, res) => {
    try {
      const bookings = await roomService.getBookings(req.params.branchId);
      res.json({ success: true, data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createBooking: async (req, res) => {
    try {
      const booking = await roomService.createBooking(req.body);
      res.status(201).json({ success: true, data: booking });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  approveBooking: async (req, res) => {
    try {
      const booking = await roomService.approveBooking(req.params.id);
      res.json({ success: true, data: booking });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  rejectBooking: async (req, res) => {
    try {
      const booking = await roomService.rejectBooking(req.params.id, req.body.reason);
      res.json({ success: true, data: booking });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getCabins: async (req, res) => {
    try {
      const cabins = await roomService.getCabins(req.params.roomId);
      res.json({ success: true, data: cabins });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createCabin: async (req, res) => {
    try {
      const cabin = await roomService.createCabin(req.params.roomId, req.body);
      res.status(201).json({ success: true, data: cabin });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  assignCabin: async (req, res) => {
    try {
      const cabin = await roomService.assignCabin(req.params.id, req.body.staffId);
      res.json({ success: true, data: cabin });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getRoomOccupancy: async (req, res) => {
    try {
      const occupancy = await roomService.getRoomOccupancy(req.params.id);
      res.json({ success: true, data: occupancy });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateOccupancy: async (req, res) => {
    try {
      const result = await roomService.updateOccupancy(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = roomController;
