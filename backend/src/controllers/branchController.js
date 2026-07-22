const Branch = require('../models/Branch');
const db = require('../config/database');
const { validateBranchAccess, validatePagination } = require('../middleware/validators');

class BranchController {
  async list(req, res, next) {
    try {
      validatePagination(req, res, () => {});

      const branches = await Branch.findAll();

      res.json({
        success: true,
        data: branches,
        count: branches.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const branch = await Branch.findById(id);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      // Get branch stats
      const stats = await Branch.getBranchStats(branch.schema_name);

      res.json({
        success: true,
        data: { ...branch, stats }
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const {
        branchCode, branchName, address, city, state, pincode,
        phone, email, website, maxStudents, maxStaff, affiliationNumber, board
      } = req.body;

      if (!branchCode || !branchName) {
        return res.status(400).json({ 
          error: 'Branch code and name are required' 
        });
      }

      const existingBranch = await Branch.findByCode(branchCode);
      if (existingBranch) {
        return res.status(400).json({ error: 'Branch code already exists' });
      }

      const branch = await Branch.create({
        branchCode,
        branchName,
        address,
        city,
        state,
        pincode,
        phone,
        email,
        website,
        maxStudents,
        maxStaff,
        affiliationNumber,
        board
      });

      res.status(201).json({
        success: true,
        message: 'Branch created successfully',
        data: branch
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      const branch = await Branch.findById(id);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const updatedBranch = await Branch.update(id, req.body);

      res.json({
        success: true,
        message: 'Branch updated successfully',
        data: updatedBranch
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const branch = await Branch.findById(id);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      await Branch.softDelete(id);

      res.json({
        success: true,
        message: 'Branch archived successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getSettings(req, res, next) {
    try {
      const { id } = req.params;

      const branch = await Branch.findById(id);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const settings = await Branch.getBranchSettings(branch.schema_name);

      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const branch = await Branch.findById(id);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const fields = [];
      const values = [];
      let paramCount = 1;

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          fields.push(`${this.toSnakeCase(key)} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const result = await db.query(
        `UPDATE ${branch.schema_name}.branch_settings 
         SET ${fields.join(', ')}, updated_at = NOW()
         RETURNING *`,
        values
      );

      res.json({
        success: true,
        message: 'Settings updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const { id } = req.params;

      const branch = await Branch.findById(id);
      if (!branch) {
        return res.status(404).json({ error: 'Branch not found' });
      }

      const stats = await Branch.getBranchStats(branch.schema_name);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  toSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}

module.exports = new BranchController();
