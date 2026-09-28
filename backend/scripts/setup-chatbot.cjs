const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const mysql = require('mysql2/promise');

async function setup() {
  process.loadEnvFile(resolve(__dirname, '../.env'));
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST, port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME, password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, ssl: { rejectUnauthorized: false },
    connectTimeout: 10000, charset: 'utf8mb4',
  });
  try {
    await connection.query(readFileSync(resolve(__dirname, '../../database/chatbot_knowledge.sql'), 'utf8'));
    const [columns] = await connection.query('SHOW COLUMNS FROM chatbot_knowledge');
    console.log('chatbot_knowledge ready: ' + columns.map(column => column.Field).join(', '));
  } finally { await connection.end(); }
}

setup().catch(error => {
  // Connection errors can include infrastructure details; print only the error code.
  console.error('Chatbot table setup failed: ' + (error.code || 'UNKNOWN'));
  process.exitCode = 1;
});
