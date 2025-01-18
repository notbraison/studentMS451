import express from 'express';

import pkg from 'pg'; // Import the default CommonJS export
const { Client } = pkg; // Destructure the Client object from the package


import cors from 'cors';
import mysql from 'mysql2';
import 'dotenv/config'

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const mysqlConnection = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'smogg',
  database: process.env.MYSQL_DATABASE || 'studentms451',
});

mysqlConnection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to MySQL');
  }
});

// PostgreSQL Connection
const pgClient = new Client({
  host: process.env.PG_HOST || 'localhost',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'pass',
  database: process.env.PG_DATABASE || 'studentms451',
});

pgClient.connect(err => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to PostgreSQL');
  }
});


// MySQL: Get all courses
app.get('/courses', (req, res) => {
  mysqlConnection.query('SELECT * FROM courses', (err, results) => {
    if (err) {
      console.error('Error fetching courses:', err.message);
      return res.status(500).json({ error: 'Failed to fetch courses' });
    }
    res.json(results);
  });
});

// MySQL: Get all students
app.get('/courses', (req, res) => {
  mysqlConnection.query('SELECT * FROM courses', (err, results) => {
    if (err) {
      console.error('Error fetching courses:', err.message);
      return res.status(500).json({ error: 'Failed to fetch courses' });
    }
    res.json(results);
  });
});

// MySQL: Get list of courses for a student
app.get('/courses/:student_id', (req, res) => {
  const studentId = req.params.student_id;

  const query = `
    SELECT c.course_id, c.course_name, c.course_credits, c.department
    FROM enrollments e
    INNER JOIN courses c ON e.course_id = c.course_id
    WHERE e.student_id = ?
  `;

  mysqlConnection.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching courses for student:', err.message);
      return res.status(500).json({ error: 'Failed to fetch courses' });
    }
    res.json(results);
  });
});

// MySQL: Enroll a student in a new course
app.post('/enroll', (req, res) => {
  const { student_id, course_id } = req.body;

  // Validate input
  if (!student_id || !course_id) {
    return res.status(400).json({ error: 'Student ID and Course ID are required' });
  }

  const query = `
    INSERT INTO enrollments (student_id, course_id, enrollment_date)
    VALUES (?, ?, NOW())
  `;

  mysqlConnection.query(query, [student_id, course_id], (err, results) => {
    if (err) {
      console.error('Error enrolling student:', err.message);
      return res.status(500).json({ error: 'Failed to enroll student' });
    }
    res.json({ message: 'Student enrolled successfully', results });
  });
});

// PostgreSQL: Get student details
app.get('/student/:student_id', async (req, res) => {
  const studentId = req.params.student_id;

  try {
    const result = await pgClient.query('SELECT * FROM students WHERE student_id = $1', [studentId]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching student details:', err.message);
    res.status(500).json({ error: 'Failed to fetch student details' });
  }
});

//Counting students enrolled in a course A
//we start course  count students
app.get('',async(req,res)=>{
const courseId = req.params.course_id;

})

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
