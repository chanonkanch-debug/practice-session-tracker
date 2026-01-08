const express = require('express');
const pool = require('./src/config/database'); // import database connections
const cors = require('cors'); // CORS
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes'); // import auth routes
const sessionRoutes = require('./src/routes/sessionRoutes'); // import session routes
const statsRoutes = require('./src/routes/statsRoutes'); // import stats routes
const userRoutes = require('./src/routes/userRoutes'); // import user routes
const sheetAnalysis = require('./src/routes/SheetAnalysisRoutes'); // import sheet analysis routes

// creates express application
const app = express();

// middleware
app.use(cors()); // allow all origin
app.use(express.json({ limit: '50mb' })); // parse incoming json data, increase limit of base64 image
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// routes
app.get('/', (req, res) => {
    res.json({ message: 'Practice Session Tracker API is running' });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

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

// Auth routes
app.use('/api/auth', authRoutes);

// Session routes
app.use('/api/sessions', sessionRoutes);

// Stats routes
app.use('/api/stats', statsRoutes);

// User routes
app.use('/api/user', userRoutes);

// Sheet Analysis routes
app.use('/api/sheet-analysis', sheetAnalysis);
    
// get port from .env variable, default is 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Sever is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`DB test: http://localhost:${PORT}/api/test-db`);
});