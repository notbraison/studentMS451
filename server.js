import express from 'express';
import mysql from 'mysql2/promise'; // Promise-based MySQL client
import pg from 'pkg';
import { Pool } from 'pg'; // PostgreSQL connection pool
import dotenv from 'dotenv'; // Environment variable loader

dotenv.config();

const app = express();
const PORT = 5000;

// MySQL Connection Pool
const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'studentMS',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// PostgreSQL Connection Pool
const pgPool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'pass',
  database: process.env.PG_DATABASE || 'studentMS',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    const [mysqlRows] = await mysqlPool.query('SELECT 1');
    const pgClient = await pgPool.connect();
    await pgClient.query('SELECT 1');
    pgClient.release();

    res.json({
      mysql: 'Connected',
      postgresql: 'Connected',
      sqlite: 'Not Tested',
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).send('Database health check failed');
  }
});

// Example Endpoint: Count Students in a Course (MySQL)
app.get('/students/count/:courseId', async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const [rows] = await mysqlPool.query(
      'SELECT COUNT(*) as count FROM students WHERE course_id = ?',
      [courseId]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Error querying MySQL:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Graceful Shutdown
const shutdown = async () => {
  console.log('Shutting down gracefully...');
  await mysqlPool.end();
  await pgPool.end();
  console.log('Database pools closed');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start Server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  // Initialize SQLite
  /* try {
    const sqliteDB = await initSQLite();
    sqliteDB.close();
  } catch (error) {
    console.error('Error initializing SQLite:', error);
  } */

  // Verify Connections
  try {
    const [mysqlCheck] = await mysqlPool.query('SELECT 1');
    console.log('MySQL connection verified:', mysqlCheck);

    const pgClient = await pgPool.connect();
    await pgClient.query('SELECT 1');
    pgClient.release();
    console.log('PostgreSQL connection verified');
  } catch (error) {
    console.error('Database verification failed:', error);
    process.exit(1);
  }
});
