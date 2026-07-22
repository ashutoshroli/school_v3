const hostelService = require('../services/hostelService');

const hostelController = {
  getRooms: async (req, res) => {
    try {
      const rooms = await hostelService.getRooms(req.params.branchId);
      res.json({ success: true, data: rooms });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createRoom: async (req, res) => {
    try {
      const room = await hostelService.createRoom(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: room });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateRoom: async (req, res) => {
    try {
      const room = await hostelService.updateRoom(req.params.id, req.body);
      res.json({ success: true, data: room });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getAllotments: async (req, res) => {
    try {
      const allotments = await hostelService.getAllotments(req.params.branchId);
      res.json({ success: true, data: allotments });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  requestAllotment: async (req, res) => {
    try {
      const allotment = await hostelService.requestAllotment(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: allotment });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  approveAllotment: async (req, res) => {
    try {
      const allotment = await hostelService.approveAllotment(req.params.id);
      res.json({ success: true, data: allotment });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  rejectAllotment: async (req, res) => {
    try {
      const allotment = await hostelService.rejectAllotment(req.params.id, req.body.reason);
      res.json({ success: true, data: allotment });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  roommateApprove: async (req, res) => {
    try {
      const allotment = await hostelService.roommateApprove(req.params.id);
      res.json({ success: true, data: allotment });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  recordAttendance: async (req, res) => {
    try {
      const attendance = await hostelService.recordAttendance(req.params.branchId, req.body);
      res.json({ success: true, data: attendance });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getAttendance: async (req, res) => {
    try {
      const attendance = await hostelService.getAttendance(req.params.branchId, req.params.date);
      res.json({ success: true, data: attendance });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getHostelFees: async (req, res) => {
    try {
      const fees = await hostelService.getHostelFees(req.params.branchId);
      res.json({ success: true, data: fees });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  waiveHostelFee: async (req, res) => {
    try {
      const result = await hostelService.waiveHostelFee(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = hostelController;
