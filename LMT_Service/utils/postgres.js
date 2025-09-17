// db/postgres.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});


async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('✅ Query executed:', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    throw err;
  }
}

// 讓你可以匯入直接用 query()
module.exports = {
  query,
  pool, // 你要手動 transaction 或其他操作可以用這個
};
