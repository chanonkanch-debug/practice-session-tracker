// pool for database connections
const { Pool } = require('pg');
require('dotenv').config();

// create a connection pool to supabase
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Event listener (runs whenever a new connection is established)
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database (Supabase)');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idel client', err);
    process.exit(-1);
});

module.exports = pool; // export for other to use pool connections