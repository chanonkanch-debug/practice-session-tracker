const express = require('express');
const router = express.Router();
const sheetAnalysisController = require('../controllers/sheetAnalysisController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware.authenticate);

// POST /api/sheet-analysis - Analyze sheet music
router.post('/', sheetAnalysisController.analyzeSheet);

// GET /api/sheet-analysis - Get all analyses
router.get('/', sheetAnalysisController.getUserAnalyses);

// GET /api/sheet-analysis/:id - Get single analysis
router.get('/:id', sheetAnalysisController.getAnalysis);

// DELETE /api/sheet-analysis/:id - Delete analysis
router.delete('/:id', sheetAnalysisController.deleteAnalysis);

module.exports = router;