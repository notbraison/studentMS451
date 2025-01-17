const mysql = require('mysql2/promise'); // Use promise-based MySQL
const { Pool } = require('pg'); // Use Pool for PostgreSQL
require('dotenv').config();

// MySQL Connection Pool
const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'smogg',
  database: process.env.MYSQL_DATABASE || 'studentms451',
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0,
});

// PostgreSQL Connection Pool
const pgPool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'password',
  database: process.env.PG_DATABASE || 'studentms451',
  max: 20, // Adjust as needed
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});




// Check Database Connections
const checkConnections = async () => {
  try {
    // MySQL Check
    const [rows] = await mysqlPool.query('SELECT 1');
    console.log('MySQL connection verified:', rows);
  } catch (err) {
    console.error('MySQL connection verification failed:', err);
  }

  try {
    // PostgreSQL Check
    const pgClient = await pgPool.connect();
    await pgClient.query('SELECT 1');
    pgClient.release();
    console.log('PostgreSQL connection verified');
  } catch (err) {
    console.error('PostgreSQL connection verification failed:', err);
  }

};


// Graceful Shutdown
const closeConnections = async () => {
  try {
    await mysqlPool.end();
    console.log('MySQL pool closed');

    await pgPool.end();
    console.log('PostgreSQL pool closed');

  } catch (error) {
    console.error('Error during shutdown:', error);
  }
};

// Handle Application Termination
process.on('SIGINT', async () => {
  console.log('Gracefully shutting down...');
  await closeConnections();
  process.exit(0);
});

// Initialize Connections
(async () => {
  try {
    await connectMongo();
    await checkConnections();
  } catch (error) {
    console.error('Error during database initialization:', error);
    process.exit(1);
  }
})();

// Export Connections
module.exports = { mysqlPool, pgPool};
