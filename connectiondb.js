const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'Sudipta@2003',
    database: 'AgricultureDB'
});

// Export the pool for shared use in other modules
module.exports = pool;