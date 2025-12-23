const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const authMiddleware = require('../middleware/authMiddleware');

// All stats routes require authentication
router.use(authMiddleware.authenticate);

// GET /api/stats/total-time?timeframe=week
router.get('/total-time', statsController.getTotalTime);

// GET /api/stats/streak
router.get('/streak', statsController.getStreak);

// GET /api/stats/consistency?days=30
router.get('/consistency', statsController.getConsistency);

// GET /api/stats/top-items?limit=10
router.get('/top-items', statsController.getTopItems);

// GET /api/stats/tempo-progression/:itemName
router.get('/tempo-progression/:itemName', statsController.getTempoProgression);

// GET /api/stats/session-trends?weeks=12
router.get('/session-trends', statsController.getSessionTrends);

// GET /api/stats/instruments
router.get('/instruments', statsController.getInstrumentBreakdown);

module.exports = router;