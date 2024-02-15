// Import the MySQL connection pool
const pool = require('./connectiondb'); // Assuming db.js is in the same directory
const express = require('express');
const bodyParser =require('body-parser');
var app=express();
const port=3000;
// Middleware for parsing JSON requests
app.use(bodyParser.json());

// API endpoint for validating username and password
app.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Get connection from pool
    const connection = await pool.getConnection();

    // Query to fetch user from database based on provided username and password
    const [rows] = await connection.execute('SELECT * FROM user WHERE username = ? AND password = ?', [username, password]);

    // Release the connection
    connection.release();

    if (rows.length > 0) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
