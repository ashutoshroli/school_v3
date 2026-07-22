const labService = require('../services/labService');

const labController = {
  getEquipment: async (req, res) => {
    try {
      const equipment = await labService.getEquipment(req.params.branchId, req.query);
      res.json({ success: true, data: equipment });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createEquipment: async (req, res) => {
    try {
      const equipment = await labService.createEquipment(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: equipment });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateEquipment: async (req, res) => {
    try {
      const equipment = await labService.updateEquipment(req.params.id, req.body);
      res.json({ success: true, data: equipment });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  issueEquipment: async (req, res) => {
    try {
      const issue = await labService.issueEquipment(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: issue });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  returnEquipment: async (req, res) => {
    try {
      const result = await labService.returnEquipment(req.params.issueId);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  reportDamage: async (req, res) => {
    try {
      const damage = await labService.reportDamage(req.body);
      res.status(201).json({ success: true, data: damage });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  waiveDamageFine: async (req, res) => {
    try {
      const result = await labService.waiveDamageFine(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getConsumables: async (req, res) => {
    try {
      const consumables = await labService.getConsumables(req.params.branchId);
      res.json({ success: true, data: consumables });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  addConsumable: async (req, res) => {
    try {
      const consumable = await labService.addConsumable(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: consumable });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getExpiringSoon: async (req, res) => {
    try {
      const items = await labService.getExpiringSoon(req.params.branchId);
      res.json({ success: true, data: items });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = labController;
