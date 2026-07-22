const timetableService = require('../services/timetableService');

const timetableController = {
  getClassTimetable: async (req, res) => {
    try {
      const timetable = await timetableService.getClassTimetable(req.params.classId);
      res.json({ success: true, data: timetable });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createClassTimetable: async (req, res) => {
    try {
      const timetable = await timetableService.createClassTimetable(req.params.classId, req.body);
      res.status(201).json({ success: true, data: timetable });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  updateClassTimetable: async (req, res) => {
    try {
      const timetable = await timetableService.updateClassTimetable(req.params.classId, req.body);
      res.json({ success: true, data: timetable });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  deleteClassTimetable: async (req, res) => {
    try {
      await timetableService.deleteClassTimetable(req.params.classId);
      res.json({ success: true, message: 'Timetable deleted' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  checkClash: async (req, res) => {
    try {
      const result = await timetableService.checkClash(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  assignSubstitute: async (req, res) => {
    try {
      const result = await timetableService.assignSubstitute(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getSubstituteSuggestions: async (req, res) => {
    try {
      const suggestions = await timetableService.getSubstituteSuggestions(req.query);
      res.json({ success: true, data: suggestions });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getExamTimetable: async (req, res) => {
    try {
      const timetable = await timetableService.getExamTimetable(req.params.examId);
      res.json({ success: true, data: timetable });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createExamTimetable: async (req, res) => {
    try {
      const timetable = await timetableService.createExamTimetable(req.params.examId, req.body);
      res.status(201).json({ success: true, data: timetable });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateExamTimetable: async (req, res) => {
    try {
      const timetable = await timetableService.updateExamTimetable(req.params.examId, req.body);
      res.json({ success: true, data: timetable });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  checkInvigilatorClash: async (req, res) => {
    try {
      const result = await timetableService.checkInvigilatorClash(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getPeriods: async (req, res) => {
    try {
      const periods = await timetableService.getPeriods(req.params.branchId);
      res.json({ success: true, data: periods });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createPeriods: async (req, res) => {
    try {
      const periods = await timetableService.createPeriods(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: periods });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updatePeriods: async (req, res) => {
    try {
      const periods = await timetableService.updatePeriods(req.params.branchId, req.body);
      res.json({ success: true, data: periods });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getTimetableSettings: async (req, res) => {
    try {
      const settings = await timetableService.getTimetableSettings(req.params.branchId);
      res.json({ success: true, data: settings });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateTimetableSettings: async (req, res) => {
    try {
      const settings = await timetableService.updateTimetableSettings(req.params.branchId, req.body);
      res.json({ success: true, data: settings });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = timetableController;
