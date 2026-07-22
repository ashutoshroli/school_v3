const admissionService = require('../services/admissionService');

const admissionController = {
  // Public routes
  submitEnquiry: async (req, res) => {
    try {
      const enquiry = await admissionService.submitEnquiry(req.body);
      res.status(201).json({ success: true, data: enquiry });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getRequirements: async (req, res) => {
    try {
      const requirements = await admissionService.getRequirements();
      res.json({ success: true, data: requirements });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getForms: async (req, res) => {
    try {
      const forms = await admissionService.getForms();
      res.json({ success: true, data: forms });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Protected routes
  getEnquiries: async (req, res) => {
    try {
      const enquiries = await admissionService.getEnquiries(req.params.branchId);
      res.json({ success: true, data: enquiries });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateEnquiry: async (req, res) => {
    try {
      const enquiry = await admissionService.updateEnquiry(req.params.id, req.body);
      res.json({ success: true, data: enquiry });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getApplications: async (req, res) => {
    try {
      const applications = await admissionService.getApplications(req.params.branchId);
      res.json({ success: true, data: applications });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createApplication: async (req, res) => {
    try {
      const application = await admissionService.createApplication(req.body);
      res.status(201).json({ success: true, data: application });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateApplication: async (req, res) => {
    try {
      const application = await admissionService.updateApplication(req.params.id, req.body);
      res.json({ success: true, data: application });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  scheduleEntranceTest: async (req, res) => {
    try {
      const result = await admissionService.scheduleEntranceTest(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  recordTestResult: async (req, res) => {
    try {
      const result = await admissionService.recordTestResult(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  checkSeatAvailability: async (req, res) => {
    try {
      const availability = await admissionService.checkSeatAvailability(req.params.branchId, req.query);
      res.json({ success: true, data: availability });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  approveApplication: async (req, res) => {
    try {
      const application = await admissionService.approveApplication(req.params.id);
      res.json({ success: true, data: application });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  rejectApplication: async (req, res) => {
    try {
      const application = await admissionService.rejectApplication(req.params.id, req.body.reason);
      res.json({ success: true, data: application });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  payAdmissionFee: async (req, res) => {
    try {
      const payment = await admissionService.payAdmissionFee(req.params.id, req.body);
      res.json({ success: true, data: payment });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  confirmAdmission: async (req, res) => {
    try {
      const admission = await admissionService.confirmAdmission(req.params.id);
      res.json({ success: true, data: admission });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  assignClassSection: async (req, res) => {
    try {
      const result = await admissionService.assignClassSection(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  assignRollNumber: async (req, res) => {
    try {
      const result = await admissionService.assignRollNumber(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getSpecialOffers: async (req, res) => {
    try {
      const offers = await admissionService.getSpecialOffers(req.params.branchId);
      res.json({ success: true, data: offers });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createSpecialOffer: async (req, res) => {
    try {
      const offer = await admissionService.createSpecialOffer(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: offer });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = admissionController;
