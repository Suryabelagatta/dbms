const express = require('express'); 
const bodyParser = require('body-parser'); //to access the variables of the html file
const path = require('path'); //to get the path of static files
const pool = require('./connectiondb.js'); // Import the connection pool from connectiondb.js

const app = express();
const port = 8000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'static_files')));

// Set up route for the root path '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static_files', 'index.html'));
});

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

// Set up route for the root path '/'
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'static_files', 'register.html'));
});

// Express route to handle registration
app.post('/register', async (req, res) => {
  try {
      const { username, password, email, userType } = req.body;
      // Call the insertUser function with provided details
      console.log([ username, password, email, userType]);
      await insertUser(username, password, email, userType);
      res.status(200).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

async function insertUser(username, password, email,userType) {
  const today = new Date();

  // Extract year, month, and day from the date
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');
  
  // Concatenate the year, month, and day with hyphens
  const currentDate = `${year}-${month}-${day}`;
  let connection;
  try {
      // Get a connection from the pool
      connection = await pool.getConnection();

      // Perform the SQL query to insert user details into the database
      const [rows, fields] = await connection.execute('INSERT INTO user (username, password, email,userType,RegistrationDate) VALUES (?, ?, ?,?,?)',[username, password, email,userType,currentDate]);

      console.log('User inserted successfully');
  } catch (error) {
      console.error('Error inserting user:', error);
  } finally {
      // Release the connection back to the pool
      if (connection) {
          connection.release();
      }
  }
}

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