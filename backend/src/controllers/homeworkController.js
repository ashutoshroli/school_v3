const homeworkService = require('../services/homeworkService');

const homeworkController = {
  getHomeworks: async (req, res) => {
    try {
      const homeworks = await homeworkService.getHomeworks(req.params.branchId, req.query);
      res.json({ success: true, data: homeworks });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createHomework: async (req, res) => {
    try {
      const homework = await homeworkService.createHomework(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: homework });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateHomework: async (req, res) => {
    try {
      const homework = await homeworkService.updateHomework(req.params.id, req.body);
      res.json({ success: true, data: homework });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteHomework: async (req, res) => {
    try {
      await homeworkService.deleteHomework(req.params.id);
      res.json({ success: true, message: 'Homework deleted' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getSubmissions: async (req, res) => {
    try {
      const submissions = await homeworkService.getSubmissions(req.params.id);
      res.json({ success: true, data: submissions });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  submitHomework: async (req, res) => {
    try {
      const submission = await homeworkService.submitHomework(req.params.id, req.body);
      res.status(201).json({ success: true, data: submission });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateSubmission: async (req, res) => {
    try {
      const submission = await homeworkService.updateSubmission(req.params.submissionId, req.body);
      res.json({ success: true, data: submission });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  gradeSubmission: async (req, res) => {
    try {
      const submission = await homeworkService.gradeSubmission(req.params.submissionId, req.body);
      res.json({ success: true, data: submission });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  requestRecheck: async (req, res) => {
    try {
      const result = await homeworkService.requestRecheck(req.params.submissionId, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getRecheckRequests: async (req, res) => {
    try {
      const requests = await homeworkService.getRecheckRequests(req.params.branchId);
      res.json({ success: true, data: requests });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  respondToRecheck: async (req, res) => {
    try {
      const result = await homeworkService.respondToRecheck(req.params.id, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getStudentHomeworks: async (req, res) => {
    try {
      const homeworks = await homeworkService.getStudentHomeworks(req.params.studentId);
      res.json({ success: true, data: homeworks });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = homeworkController;
