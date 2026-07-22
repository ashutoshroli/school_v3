const canteenService = require('../services/canteenService');

const canteenController = {
  getInventory: async (req, res) => {
    try {
      const inventory = await canteenService.getInventory(req.params.branchId);
      res.json({ success: true, data: inventory });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  addInventoryItem: async (req, res) => {
    try {
      const item = await canteenService.addInventoryItem(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateInventory: async (req, res) => {
    try {
      const item = await canteenService.updateInventory(req.params.id, req.body);
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateStock: async (req, res) => {
    try {
      const item = await canteenService.updateStock(req.params.id, req.body.quantity);
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createReplenishRequest: async (req, res) => {
    try {
      const request = await canteenService.createReplenishRequest(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: request });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getReplenishRequests: async (req, res) => {
    try {
      const requests = await canteenService.getReplenishRequests(req.params.branchId);
      res.json({ success: true, data: requests });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  approveReplenishRequest: async (req, res) => {
    try {
      const request = await canteenService.approveReplenishRequest(req.params.id);
      res.json({ success: true, data: request });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getWallets: async (req, res) => {
    try {
      const wallets = await canteenService.getWallets(req.params.branchId);
      res.json({ success: true, data: wallets });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getWalletBalance: async (req, res) => {
    try {
      const balance = await canteenService.getWalletBalance(req.params.userId);
      res.json({ success: true, data: { balance } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  rechargeWallet: async (req, res) => {
    try {
      const result = await canteenService.rechargeWallet(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deductFromWallet: async (req, res) => {
    try {
      const result = await canteenService.deductFromWallet(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  createBill: async (req, res) => {
    try {
      const bill = await canteenService.createBill(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: bill });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  getTodaySales: async (req, res) => {
    try {
      const sales = await canteenService.getTodaySales(req.params.branchId);
      res.json({ success: true, data: sales });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getAppliances: async (req, res) => {
    try {
      const appliances = await canteenService.getAppliances(req.params.branchId);
      res.json({ success: true, data: appliances });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  addAppliance: async (req, res) => {
    try {
      const appliance = await canteenService.addAppliance(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: appliance });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateApplianceMaintenance: async (req, res) => {
    try {
      const appliance = await canteenService.updateApplianceMaintenance(req.params.id, req.body);
      res.json({ success: true, data: appliance });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = canteenController;
