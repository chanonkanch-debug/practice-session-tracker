const express = require('express');
const router = express.Router(); // create mini route app
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me (protected)
router.get('/me', authMiddleware.authenticate, authController.getCurrentUser);

module.exports = router;