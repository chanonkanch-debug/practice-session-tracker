const express = require('express');
const router = express.Router(); // create mini route app
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

// All session routes require authentication (applying middleware to every route)

// apply middleware to ALL routes in this router
router.use(authMiddleware.authenticate)

// POST /api/sessions
router.post('/', sessionController.createSession);

// GET
router.get('/',  sessionController.getAllsessions);

// GET /api/sessions/
router.get('/:id', sessionController.getSessionById);

module.exports = router;