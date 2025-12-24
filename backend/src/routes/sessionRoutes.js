const express = require('express');
const router = express.Router(); // create mini route app
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');
const sessionItemRoutes = require('./sessionItemRoutes');

// Mount item routes first
router.use('/:sessionId/items', sessionItemRoutes);

// All session routes require authentication (applying middleware to every route)
// apply middleware to ALL routes in this router
router.use(authMiddleware.authenticate)

// POST /api/sessions   
router.post('/', sessionController.createSession);

// GET /api/sessions
router.get('/',  sessionController.getAllsessions);

// GET /api/sessions/:id
router.get('/:id', sessionController.getSessionById);

// PUT /api/sessions/:id 
router.put('/:id', sessionController.updateSession);

// DELETE /api/sessions/:id
router.delete('/:id', sessionController.deleteSession);

module.exports = router;