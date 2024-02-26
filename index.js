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

app.get('/consumer', (req, res) => {
  res.sendFile(path.join(__dirname, 'static_files', 'product.html'));
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
      res.json({ valid: true, UserType:rows[0].UserType, UserId:rows[0].UserID});
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
  res.sendFile(path.join(__dirname,'static_files', 'register.html'));
});

// // Set up route for the root path '/'
// app.get('/farmer', (req, res) => {
//   res.sendFile(path.join(__dirname,'static_files', 'farmer.html'));
// });

// Express route to handle registration
app.post('/register', async (req, res) => {
  try {
      const { username, password, email, userType } = req.body;
      // Call the insertUser function with provided details

      console.log([ username, password, email, userType]);
      try{
        const connection = await pool.getConnection();

        await insertUser(username, password, email, userType, connection);

      if(userType=='farmer'){
        const{farmerName,farmerLocation,farmerContactInfo,farmerDescription}=req.body;
        await insertFarmer(username,farmerName, farmerLocation, farmerContactInfo, farmerDescription,connection);
      }
      else if(userType=='consumer'){
        const{consumerName,consumerAddress,consumerContactInfo}=req.body;
        await insertConsumer(username,consumerName, consumerAddress, consumerContactInfo,connection);
      }
      connection.release();
      } catch (error) {
      console.error('Error inserting consumer:', error);
      throw error;
  }
      res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update the route to /api/products
app.get('/products', async (req, res) => {
  try {
    // Call the asynchronous getAllProducts function to retrieve all products
    const products = await getAllProducts();

    // Send the retrieved products to the frontend
    res.json(products[0]);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
});



// API endpoint to fetch data for a specific farmer
app.get('/farmer/:id', async (req, res) => {
  const farmerId = parseInt(req.params.id);

  try {
    // Call the asynchronous function to fetch data for the farmer
    const farmerData = await fetchDataForFarmer(farmerId);
    console.log(farmerData);
    // Send the obtained farmer data as a JSON response
    res.json(farmerData);
  } catch (error) {
    // If an error occurs, send an error response
    res.status(500).json({ error: error.message });
  }
});



// Define a route to handle product requests
app.get('/product/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    // Acquire a connection from the pool
    const connection = await pool.getConnection();
    
    // Query to fetch product details based on ProductID
    const query = 'SELECT ProductID, ProductName, Description, Price, QuantityAvailable FROM product WHERE ProductID = ?';

    // Execute the query
    const [rows] = await connection.query(query, [productId]);
    
    // Release the connection back to the pool
    connection.release();

    // Check if the product exists
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Return the product details
    console.log(rows[0])
    return res.json(rows[0]);

  } catch (error) {
    console.error('Error fetching product details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



async function fetchDataForFarmer(farmerId) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT Farmer.FarmName,Farmer.Location,Farmer.ContactInfo, Product.ProductName, Product.QuantityAvailable, Review.Comments, Product.Description
      FROM Product
      JOIN Farmer ON Product.FarmerID = Farmer.FarmerID
      LEFT JOIN Review ON Product.ProductID = Review.ProductID
      WHERE Farmer.FarmerID = ?`,
      [farmerId]
    );
    connection.release();
    return rows;
  } catch (error) {
    throw new Error('Error fetching data: ' + error.message);
  }
}


// Function to retrieve all products asynchronously
async function getAllProducts() {
  try {
      const connection = await pool.getConnection();
      const result = await connection.execute('SELECT ProductID,ProductName,Description,Images FROM product');
      connection.release();
      console.log(result);
      // Return all products
      return result;
      
  } catch (error) {
      throw new Error('Error retrieving products: ' + error.message);
  }
}



async function insertUser(username, password, email,userType,connection) {
  const today = new Date();

  // Extract year, month, and day from the date
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');
  
  // Concatenate the year, month, and day with hyphens
  const currentDate = `${year}-${month}-${day}`;
  try {
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







async function insertFarmer(username,fullname, location, contactinfo, description,connection) {
  try {
    const [ids]=await connection.execute('SELECT UserID FROM User WHERE username = ?;',[username]);
    const UserID=ids[0].UserID;
      console.log([UserID,username,fullname,location,contactinfo,description]);
      const [rows] = await connection.execute('INSERT INTO farmer (FarmerID,UserID,Farmname, location, contactInfo, description) VALUES (?,?,?, ?, ?, ?)', [UserID,UserID,fullname, location, contactinfo, description]);
      return rows;
  } catch (error) {
      console.error('Error inserting farmer:', error);
      throw error;
  }
}

// Function to insert data for consumer
async function insertConsumer(username,fullname, address, contactinfo,connection) {
  try {
      const [ids]=await connection.execute('SELECT UserID FROM User WHERE username = ?;',[username]);
      const UserID=ids[0].UserID;
      const [rows] = await connection.execute('INSERT INTO consumer (ConsumerID,UserID,fullname, address, contactinfo) VALUES ( ?, ?, ?, ?, ?);', [UserID,UserID,fullname, address, contactinfo]);
      return rows;
  } catch (error) {
      console.error('Error inserting consumer:', error);
      throw error;
  }
}


// Define the getUsers function
async function getUsers(username, password,connection) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT UserID,Username, Password,UserType FROM User WHERE Username = ? AND Password = ?;', [username, password]);
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