const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    error: 'Validation failed',
    details: errors.array().map(err => ({
      field: err.path,
      message: err.msg,
      value: err.value
    }))
  });
};

const validateBranchAccess = async (req, res, next) => {
  const { branchId } = req.params;
  
  if (!branchId) {
    return res.status(400).json({ error: 'Branch ID is required' });
  }

  // Verify branch exists and is active
  const Branch = require('../models/Branch');
  const branch = await Branch.findById(branchId);
  
  if (!branch) {
    return res.status(404).json({ error: 'Branch not found' });
  }

  if (branch.status !== 'active') {
    return res.status(403).json({ error: 'Branch is not active' });
  }

  req.branch = branch;
  req.schemaName = branch.schema_name;
  next();
};

const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  
  req.pagination = {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)),
    offset: (page - 1) * limit
  };
  
  next();
};

const validateSchema = (schemaName) => {
  return async (req, res, next) => {
    if (!schemaName.startsWith('branch_')) {
      return res.status(400).json({ error: 'Invalid schema name' });
    }

    const result = await require('../config/database').query(
      "SELECT 1 FROM information_schema.schemata WHERE schema_name = $1",
      [schemaName]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Branch schema not found' });
    }

    next();
  };
};

module.exports = {
  validate,
  validateBranchAccess,
  validatePagination,
  validateSchema
};
