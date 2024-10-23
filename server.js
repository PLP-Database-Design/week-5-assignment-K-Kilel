const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();

// This middleware allows your app to parse JSON bodies in requests
app.use(express.json());

// Database Connection
require('dotenv').config();

// MySQL connection
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

// // // Question 1
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving patients:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // Send the results back as JSON
    res.json(results);
  });
});

// Question 2
app.get('/providers', (req,res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving providers:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // Send the results back as JSON
    res.json(results);
  });  
});

// Question 3
app.get('/first_name', (req,res) => {
  const firstName = req.query.first_name;
  let query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  if (firstName) {
    query += 'WHERE first_name = ?';
  }

  connection.query(query,firstName ? [firstName]: [], (err, results) => {
    if (err) {
      console.error('Error retrieving first_name:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // Send the results back as JSON
    res.json(results);
  });
})

// Question 4
app.get('/speciality', (req,res) => {
  const Speciality = req.query.provider_specialty;
  let query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  if (Speciality) {
    query += 'WHERE provider_specialty = ?';
  }

  connection.query(query,Speciality ? [Speciality]: [], (err, results) => {
    if (err) {
      console.error('Error retrieving speciality:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // Send the results back as JSON
    res.json(results);
  });
})


// listen to the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`)
})