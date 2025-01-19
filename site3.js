import express from 'express';
import mysql from 'mysql2/promise';  // MySQL client with promise support
import dotenv from 'dotenv';  // Load environment variables

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

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

// Route to get non-CS senior students (year > 2)
app.get('/senior_students', async (req, res) => {
  try {
    const [rows] = await mysqlPool.query('SELECT * FROM senior_students');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching senior students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get advanced non-CS courses (credits > 2)
app.get('/advanced_courses', async (req, res) => {
  try {
    const [rows] = await mysqlPool.query('SELECT * FROM advanced_courses');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching advanced courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get non-CS completed enrollments (status = 'DONE')
app.get('/completed_enrollments', async (req, res) => {
  try {
    const [rows] = await mysqlPool.query('SELECT * FROM completed_enrollments');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching completed enrollments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get a specific student's completed enrollments
app.get('/completed_enrollments/:s_id', async (req, res) => {
  const { s_id } = req.params;
  try {
    const [rows] = await mysqlPool.query(
      'SELECT * FROM completed_enrollments WHERE s_id = ?',
      [s_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(`Error fetching enrollments for student ${s_id}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get a specific course's advanced non-CS enrollments
app.get('/advanced_courses/:c_id', async (req, res) => {
  const { c_id } = req.params;
  try {
    const [rows] = await mysqlPool.query(
      'SELECT * FROM advanced_courses WHERE c_id = ?',
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
  console.log(`Site 3 server is running on port ${PORT}`);
});


/* 
/senior_students → Fetch all non-CS students with year > 2.
/advanced_courses → Fetch non-CS courses with credits > 2.
/completed_enrollments → Fetch enrollments where status = 'DONE'.
/completed_enrollments/:s_id → Get completed enrollments for a specific student.
/advanced_courses/:c_id → Get details for a specific advanced course.
*/