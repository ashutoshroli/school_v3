const db = require('../config/database');
const Branch = require('../models/Branch');
const { v4: uuidv4 } = require('uuid');

class FeeController {
  // Fee Categories
  async listCategories(req, res, next) {
    try {
      const { branchId } = req.params;
      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const result = await db.query(
        `SELECT * FROM ${schema}.fee_categories ORDER BY category_name`
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const { branchId } = req.params;
      const { categoryName, categoryCode, isMandatory, isOneTime, paymentCycle, lateFeeAmount } = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const id = uuidv4();

      const result = await db.query(
        `INSERT INTO ${schema}.fee_categories 
         (id, category_name, category_code, is_mandatory, is_one_time, payment_cycle, late_fee_amount)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [id, categoryName, categoryCode, isMandatory ?? true, isOneTime ?? false, paymentCycle || 'quarterly', lateFeeAmount || 0]
      );

      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  // Fee Structure
  async getFeeStructure(req, res, next) {
    try {
      const { branchId, classId } = req.params;
      const { academicYear } = req.query;

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const result = await db.query(
        `SELECT fs.*, c.class_name, fc.category_name
         FROM ${schema}.fee_structure fs
         JOIN ${schema}.classes c ON fs.class_id = c.id
         JOIN ${schema}.fee_categories fc ON fs.fee_category_id = fc.id
         WHERE fs.class_id = $1 AND fs.academic_year = $2`,
        [classId, academicYear || '2024-25']
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  }

  async setFeeStructure(req, res, next) {
    try {
      const { branchId } = req.params;
      const { classId, feeCategoryId, academicYear, amount } = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const id = uuidv4();

      const result = await db.query(
        `INSERT INTO ${schema}.fee_structure (id, class_id, fee_category_id, academic_year, amount)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (class_id, fee_category_id, academic_year)
         DO UPDATE SET amount = $5
         RETURNING *`,
        [id, classId, feeCategoryId, academicYear, amount]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  // Student Fees
  async getStudentFees(req, res, next) {
    try {
      const { branchId, studentId } = req.params;
      const { academicYear } = req.query;

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const result = await db.query(
        `SELECT sf.*, fc.category_name, fc.payment_cycle
         FROM ${schema}.student_fees sf
         JOIN ${schema}.fee_categories fc ON sf.fee_category_id = fc.id
         WHERE sf.student_id = $1 AND sf.academic_year = $2
         ORDER BY fc.category_name`,
        [studentId, academicYear || '2024-25']
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  }

  async assignFee(req, res, next) {
    try {
      const { branchId } = req.params;
      const { studentId, feeCategoryId, academicYear, totalAmount, dueDate } = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const id = uuidv4();

      const result = await db.query(
        `INSERT INTO ${schema}.student_fees 
         (id, student_id, fee_category_id, academic_year, total_amount, pending_amount, due_date)
         VALUES ($1, $2, $3, $4, $5, $5, $6)
         ON CONFLICT (student_id, fee_category_id, academic_year)
         DO UPDATE SET total_amount = $5, pending_amount = $5 - ${schema}.student_fees.paid_amount
         RETURNING *`,
        [id, studentId, feeCategoryId, academicYear, totalAmount, dueDate]
      );

      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  // Fee Payments
  async getPaymentHistory(req, res, next) {
    try {
      const { branchId, studentId } = req.params;
      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;
      const result = await db.query(
        `SELECT fp.*, fpd.student_fee_id
         FROM ${schema}.fee_payments fp
         LEFT JOIN ${schema}.fee_payment_details fpd ON fp.id = fpd.payment_id
         WHERE fp.student_id = $1
         ORDER BY fp.payment_date DESC`,
        [studentId]
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      next(error);
    }
  }

  async recordPayment(req, res, next) {
    try {
      const { branchId } = req.params;
      const { studentId, amount, paymentMethod, transactionId, bankName, remarks, feeBreakdown } = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;

      // Generate receipt number
      const receiptResult = await db.query(
        `SELECT 'RCP' || to_char(NOW(), 'YYYYMM') || LPAD((COUNT(*) + 1)::TEXT, 6, '0') as receipt_num
         FROM ${schema}.fee_payments`
      );
      const receiptNumber = receiptResult.rows[0].receipt_num;

      const paymentId = uuidv4();
      const paymentDate = new Date();

      // Start transaction
      await db.transaction(async (client) => {
        // Insert payment
        await client.query(
          `INSERT INTO ${schema}.fee_payments 
           (id, receipt_number, student_id, amount, payment_method, payment_date, transaction_id, bank_name, remarks, received_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [paymentId, receiptNumber, studentId, amount, paymentMethod, paymentDate, transactionId, bankName, remarks, req.user?.id]
        );

        // Update student fees
        for (const item of feeBreakdown || []) {
          await client.query(
            `UPDATE ${schema}.student_fees 
             SET paid_amount = paid_amount + $1,
                 pending_amount = GREATEST(pending_amount - $1, 0),
                 status = CASE WHEN pending_amount - $1 <= 0 THEN 'paid' ELSE 'partial' END,
                 updated_at = NOW()
             WHERE id = $2`,
            [item.amount, item.studentFeeId]
          );

          // Insert payment detail
          const detailId = uuidv4();
          await client.query(
            `INSERT INTO ${schema}.fee_payment_details (id, payment_id, student_fee_id, amount)
             VALUES ($1, $2, $3, $4)`,
            [detailId, paymentId, item.studentFeeId, item.amount]
          );
        }
      });

      res.status(201).json({
        success: true,
        message: 'Payment recorded successfully',
        data: { receiptNumber, amount, paymentDate }
      });
    } catch (error) {
      next(error);
    }
  }

  // Fee Waiver
  async requestWaiver(req, res, next) {
    try {
      const { branchId } = req.params;
      const { studentFeeId, waiverAmount, reason } = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) return res.status(404).json({ error: 'Branch not found' });

      const schema = branch.schema_name;

      const result = await db.query(
        `UPDATE ${schema}.student_fees 
         SET waiver_amount = $1,
             pending_amount = GREATEST(pending_amount - $1, 0),
             waiver_approved_by = $2,
             waiver_approved_at = NOW(),
             updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [waiverAmount, req.user?.id, studentFeeId]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FeeController();
