//connections for all 3 databases

// db.js
const mysql = require('mysql2');
const { Client } = require('pg');
const mongoose = require('mongoose');

// MySQL Connection
const mysqlConnection = mysql.createConnection({
  host: 'localhost',  // Change as needed
  user: 'root',       // Your MySQL user
  password: 'smogg',   // Your MySQL password
  database: 'studentms451', // Your MySQL database name
});

// PostgreSQL Connection
const pgClient = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'password',
  database: 'studentms451', // PostgreSQL DB name
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/studentms451', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = { mysqlConnection, pgClient, mongoose };
