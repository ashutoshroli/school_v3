const transportService = require('../services/transportService');

const transportController = {
  getVehicles: async (req, res) => {
    try {
      const { branchId } = req.params;
      const vehicles = await transportService.getVehicles(branchId);
      res.json({ success: true, data: vehicles });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getVehicleById: async (req, res) => {
    try {
      const { id } = req.params;
      const vehicle = await transportService.getVehicleById(id);
      if (!vehicle) {
        return res.status(404).json({ success: false, error: 'Vehicle not found' });
      }
      res.json({ success: true, data: vehicle });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createVehicle: async (req, res) => {
    try {
      const { branchId } = req.params;
      const vehicle = await transportService.createVehicle(branchId, req.body);
      res.status(201).json({ success: true, data: vehicle });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateVehicle: async (req, res) => {
    try {
      const { id } = req.params;
      const vehicle = await transportService.updateVehicle(id, req.body);
      res.json({ success: true, data: vehicle });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteVehicle: async (req, res) => {
    try {
      await transportService.deleteVehicle(req.params.id);
      res.json({ success: true, message: 'Vehicle deleted' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getRoutes: async (req, res) => {
    try {
      const routes = await transportService.getRoutes(req.params.branchId);
      res.json({ success: true, data: routes });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createRoute: async (req, res) => {
    try {
      const route = await transportService.createRoute(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: route });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateRoute: async (req, res) => {
    try {
      const route = await transportService.updateRoute(req.params.id, req.body);
      res.json({ success: true, data: route });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getVehicleLocation: async (req, res) => {
    try {
      const location = await transportService.getVehicleLocation(req.params.id);
      res.json({ success: true, data: location });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  trackVehicle: async (req, res) => {
    try {
      const tracking = await transportService.trackVehicle(req.params.id);
      res.json({ success: true, data: tracking });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getDieselRequests: async (req, res) => {
    try {
      const requests = await transportService.getDieselRequests(req.params.branchId);
      res.json({ success: true, data: requests });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createDieselRequest: async (req, res) => {
    try {
      const request = await transportService.createDieselRequest(req.body);
      res.status(201).json({ success: true, data: request });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  approveDieselRequest: async (req, res) => {
    try {
      const request = await transportService.approveDieselRequest(req.params.id);
      res.json({ success: true, data: request });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  rejectDieselRequest: async (req, res) => {
    try {
      const request = await transportService.rejectDieselRequest(req.params.id, req.body.reason);
      res.json({ success: true, data: request });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  assignDriver: async (req, res) => {
    try {
      const result = await transportService.assignDriver(req.params.id, req.body.driverId);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  assignStudentToRoute: async (req, res) => {
    try {
      const result = await transportService.assignStudentToRoute(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = transportController;
