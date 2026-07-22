const inventoryService = require('../services/inventoryService');

const inventoryController = {
  getItems: async (req, res) => {
    try {
      const items = await inventoryService.getItems(req.params.branchId, req.query);
      res.json({ success: true, data: items });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createItem: async (req, res) => {
    try {
      const item = await inventoryService.createItem(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateItem: async (req, res) => {
    try {
      const item = await inventoryService.updateItem(req.params.id, req.body);
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getLowStockItems: async (req, res) => {
    try {
      const items = await inventoryService.getLowStockItems(req.params.branchId);
      res.json({ success: true, data: items });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateStock: async (req, res) => {
    try {
      const item = await inventoryService.updateStock(req.params.id, req.body);
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createPurchaseRequest: async (req, res) => {
    try {
      const request = await inventoryService.createPurchaseRequest(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: request });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getPurchaseRequests: async (req, res) => {
    try {
      const requests = await inventoryService.getPurchaseRequests(req.params.branchId);
      res.json({ success: true, data: requests });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  approvePurchaseRequest: async (req, res) => {
    try {
      const request = await inventoryService.approvePurchaseRequest(req.params.id);
      res.json({ success: true, data: request });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  rejectPurchaseRequest: async (req, res) => {
    try {
      const request = await inventoryService.rejectPurchaseRequest(req.params.id, req.body.reason);
      res.json({ success: true, data: request });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  issueItem: async (req, res) => {
    try {
      const issue = await inventoryService.issueItem(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: issue });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  returnItem: async (req, res) => {
    try {
      const result = await inventoryService.returnItem(req.params.issueId);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getIssuedItems: async (req, res) => {
    try {
      const items = await inventoryService.getIssuedItems(req.params.branchId);
      res.json({ success: true, data: items });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  reportDamage: async (req, res) => {
    try {
      const damage = await inventoryService.reportDamage(req.body);
      res.status(201).json({ success: true, data: damage });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  waiveDamageFine: async (req, res) => {
    try {
      const result = await inventoryService.waiveDamageFine(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = inventoryController;
