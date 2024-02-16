const express = require('express'); 
const bodyParser = require('body-parser'); //to access the variables of the html file
const path = require('path'); //to get the path of static files
const pool = require('./connectiondb.js'); // Import the connection pool from connectiondb.js

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'static_files')));

app.post('/validate', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ success: false, message: 'Username or password is missing' });
    }

    // Call the getUsers function to retrieve user information from the database
    const rows = await getUsers(username, password);

    // If no user found with the provided username and password
    if (!rows || rows.length === 0) {
      return res.json({ valid: false});
    }

    if (rows[0].Password==password) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Define the getUsers function
async function getUsers(username, password) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT Username, Password FROM User WHERE Username = ? AND Password = ?;', [username, password]);
    connection.release();
    return rows;
  } catch (error) {
    console.error('Error executing SQL query:', error);
    throw error;
  }
}


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });