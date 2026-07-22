const { Pool } = require('pg');
const config = require('./index');
const logger = require('../utils/logger');

const pool = new Pool(config.db.connectionString ? 
  { connectionString: config.db.connectionString } : 
  config.db
);

pool.on('connect', () => {
  logger.info('Database connected successfully');
});

pool.on('error', (err) => {
  logger.error('Unexpected database error:', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  
  getClient: async () => {
    const client = await pool.connect();
    return client;
  },
  
  transaction: async (callback) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
  
  getBranchSchema: (branchId) => {
    return `branch_${branchId}`;
  },
  
  queryWithBranch: async (schema, text, params) => {
    const query = text.replace(/\btemplate\./g, `${schema}.`);
    return pool.query(query, params);
  },
  
  close: async () => {
    await pool.end();
    logger.info('Database connection closed');
  }
};
