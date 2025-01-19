import express from 'express';

// PostgreSQL connection pool
import pg from 'pg';
const { Pool } = pg;

import dotenv from 'dotenv';  // Load environment variables

dotenv.config();

const app = express();
const PORT = 3004;

// PostgreSQL Connection Pool
const pgPool = new Pool({
  host: 'localhost' /* 'postgres*/,
  user: 'postgres',
  password:'pass',
  database: 'studentMS',
  port: 5432, 
  max: 20,  // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pgPool.connect()
.then(client => {
  console.log('Connected to PostgreSQL');
  client.release();
})
.catch(err => {
  console.error('Error connecting to PostgreSQL:', err);
});

// Route to get junior non-CS students (year ≤ 2)
app.get('/junior_students', async (req, res) => {
  try {
    const { rows } = await pgPool.query('SELECT * FROM junior_students');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching junior students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get non-CS courses with credits ≤ 2
app.get('/basic_courses', async (req, res) => {
  try {
    const { rows } = await pgPool.query('SELECT * FROM basic_courses');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching basic courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get enrollments for non-CS students who have NOT completed their courses (status != 'DONE')
app.get('/pending_enrollments', async (req, res) => {
  try {
    const { rows } = await pgPool.query('SELECT * FROM pending_enrollments');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching pending enrollments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get pending enrollments for a specific student
app.get('/pending_enrollments/:s_id', async (req, res) => {
  const { s_id } = req.params;
  try {
    const { rows } = await pgPool.query(
      'SELECT * FROM pending_enrollments WHERE s_id = $1',
      [s_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(`Error fetching enrollments for student ${s_id}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get a specific basic non-CS course
app.get('/basic_courses/:c_id', async (req, res) => {
  const { c_id } = req.params;
  try {
    const { rows } = await pgPool.query(
      'SELECT * FROM basic_courses WHERE c_id = $1',
      [c_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(`Error fetching course ${c_id}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Site 4 server is running on port ${PORT}`);
});

/* 
/junior_students → Fetches non-CS students with year ≤ 2.
/basic_courses → Fetches non-CS courses with credits ≤ 2.
/pending_enrollments → Fetches enrollments for non-CS students who have not completed their courses.
/pending_enrollments/:s_id → Fetches pending enrollments for a specific student.
/basic_courses/:c_id → Fetches specific basic non-CS course details.
*/