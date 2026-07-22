const libraryService = require('../services/libraryService');

const libraryController = {
  getBooks: async (req, res) => {
    try {
      const books = await libraryService.getBooks(req.params.branchId, req.query);
      res.json({ success: true, data: books });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getBookById: async (req, res) => {
    try {
      const book = await libraryService.getBookById(req.params.id);
      if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
      res.json({ success: true, data: book });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  createBook: async (req, res) => {
    try {
      const book = await libraryService.createBook(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: book });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateBook: async (req, res) => {
    try {
      const book = await libraryService.updateBook(req.params.id, req.body);
      res.json({ success: true, data: book });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  issueBook: async (req, res) => {
    try {
      const result = await libraryService.issueBook(req.params.branchId, req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  returnBook: async (req, res) => {
    try {
      const result = await libraryService.returnBook(req.params.issueId);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getIssuedBooks: async (req, res) => {
    try {
      const books = await libraryService.getIssuedBooks(req.params.branchId);
      res.json({ success: true, data: books });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getOverdueBooks: async (req, res) => {
    try {
      const books = await libraryService.getOverdueBooks(req.params.branchId);
      res.json({ success: true, data: books });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getFines: async (req, res) => {
    try {
      const fines = await libraryService.getFines(req.params.branchId);
      res.json({ success: true, data: fines });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  waiveFine: async (req, res) => {
    try {
      const result = await libraryService.waiveFine(req.params.id, req.body.amount);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  payFine: async (req, res) => {
    try {
      const result = await libraryService.payFine(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  inventoryReport: async (req, res) => {
    try {
      const report = await libraryService.inventoryReport(req.params.branchId);
      res.json({ success: true, data: report });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  overdueReport: async (req, res) => {
    try {
      const report = await libraryService.overdueReport(req.params.branchId);
      res.json({ success: true, data: report });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = libraryController;
