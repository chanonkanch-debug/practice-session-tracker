const express = require('express');
const pool = require('./src/config/database'); // import database connections

require('dotenv').config();

// creates the app
const app = express();

app.use(express.json()); // parse incoming json data

app.get('/', (req, res) => {
    res.json({ message: 'Practice Session Tracker API is running' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Sever is running on port ${PORT}`);
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

// Database test endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');

        res.status(200).json({
            message: 'Database connection successful',
            currentTime: result.rows[0].now
        })

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            message: 'Database connection failed',
            error: error.message
        })
    }
});