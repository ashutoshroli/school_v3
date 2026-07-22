const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('connect', () => console.log('Database connected'));
pool.on('error', (err) => console.error('Database error:', err));

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: async () => pool.connect(),
  close: async () => pool.end()
};
