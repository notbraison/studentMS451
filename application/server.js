//basic API routes

// server.js
const express = require('express');
const cors = require('cors');
const { mysqlConnection, pgClient, mongoose } = require('./db');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

app.get('/courses',(req,res)=>{
  mysqlConnection.query('SELECT * FROM courses',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// MySQL: Get list of courses for a student
app.get('/courses/:student_id', (req, res) => {
  const studentId = req.params.student_id;

  const query = `
    SELECT c.course_id, c.course_name, c.course_credits, c.department
    FROM enrollments e
    INNER JOIN Courses c ON e.course_id = c.course_id
    WHERE e.student_id = ?
  `;

  mysqlConnection.query(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching courses:', err.message);
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
    INSERT INTO Enrollments (student_id, course_id, enrollment_date)
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
    await pgClient.connect();
    const result = await pgClient.query(
      `SELECT * FROM Students WHERE student_id = ${studentId}`
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await pgClient.end();
  }
});

// MongoDB: Get course details
app.get('/course/:course_id', async (req, res) => {
  const courseId = req.params.course_id;
  try {
    const course = await mongoose.model('Course').findOne({ course_id: courseId });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
