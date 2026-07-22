const messService = require('../services/messService');

const messController = {
  getMenu: async (req, res) => {
    try {
      const menu = await messService.getMenu(req.params.branchId, req.query.week);
      res.json({ success: true, data: menu });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createMenu: async (req, res) => {
    try {
      const menu = await messService.createMenu(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: menu });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateMenu: async (req, res) => {
    try {
      const menu = await messService.updateMenu(req.params.id, req.body);
      res.json({ success: true, data: menu });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  submitMenuApproval: async (req, res) => {
    try {
      const result = await messService.submitMenuApproval(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  approveMenu: async (req, res) => {
    try {
      const result = await messService.approveMenu(req.params.id, req.body.approvedBy);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getSubscribers: async (req, res) => {
    try {
      const subscribers = await messService.getSubscribers(req.params.branchId);
      res.json({ success: true, data: subscribers });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  subscribeUser: async (req, res) => {
    try {
      const subscription = await messService.subscribeUser(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: subscription });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  unsubscribeUser: async (req, res) => {
    try {
      const result = await messService.unsubscribeUser(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getBilling: async (req, res) => {
    try {
      const billing = await messService.getBilling(req.params.branchId);
      res.json({ success: true, data: billing });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  generateMonthlyBill: async (req, res) => {
    try {
      const result = await messService.generateMonthlyBill(req.params.branchId);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  waiveBill: async (req, res) => {
    try {
      const result = await messService.waiveBill(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  recordGuestMeal: async (req, res) => {
    try {
      const result = await messService.recordGuestMeal(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getGuestMeals: async (req, res) => {
    try {
      const meals = await messService.getGuestMeals(req.params.branchId);
      res.json({ success: true, data: meals });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = messController;
