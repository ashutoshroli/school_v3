const payrollService = require('../services/payrollService');

const payrollController = {
  getSalaryStructures: async (req, res) => {
    try {
      const structures = await payrollService.getSalaryStructures(req.params.branchId);
      res.json({ success: true, data: structures });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createSalaryStructure: async (req, res) => {
    try {
      const structure = await payrollService.createSalaryStructure(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: structure });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateSalaryStructure: async (req, res) => {
    try {
      const structure = await payrollService.updateSalaryStructure(req.params.id, req.body);
      res.json({ success: true, data: structure });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getRatings: async (req, res) => {
    try {
      const ratings = await payrollService.getRatings(req.params.branchId, req.query);
      res.json({ success: true, data: ratings });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  submitStudentRating: async (req, res) => {
    try {
      const rating = await payrollService.submitStudentRating(req.body);
      res.status(201).json({ success: true, data: rating });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  submitParentRating: async (req, res) => {
    try {
      const rating = await payrollService.submitParentRating(req.body);
      res.status(201).json({ success: true, data: rating });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  submitPrincipalTeacherRating: async (req, res) => {
    try {
      const rating = await payrollService.submitPrincipalTeacherRating(req.body);
      res.status(201).json({ success: true, data: rating });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getIncrementCandidates: async (req, res) => {
    try {
      const candidates = await payrollService.getIncrementCandidates(req.params.branchId);
      res.json({ success: true, data: candidates });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  applyIncrement: async (req, res) => {
    try {
      const result = await payrollService.applyIncrement(req.params.staffId, req.body.incrementPercent);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  calculatePayroll: async (req, res) => {
    try {
      const payroll = await payrollService.calculatePayroll(req.params.branchId, req.body);
      res.json({ success: true, data: payroll });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getPayroll: async (req, res) => {
    try {
      const payroll = await payrollService.getPayroll(req.params.branchId, req.params.month, req.params.year);
      res.json({ success: true, data: payroll });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateStaffSalary: async (req, res) => {
    try {
      const result = await payrollService.updateStaffSalary(req.params.staffId, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  disburseSalaries: async (req, res) => {
    try {
      const result = await payrollService.disburseSalaries(req.params.branchId, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = payrollController;
