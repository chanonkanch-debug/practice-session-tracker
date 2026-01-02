const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware.authenticate);

// GET /api/user/profile - Get current user profile
router.get('/profile', userController.getProfile);

// PUT /api/user/profile - Update user profile
router.put('/profile', userController.updateProfile);

// GET /api/user/settings - Get user settings
router.get('/settings', userController.getSettings);

// PUT /api/user/settings - Update user settings
router.put('/settings', userController.updateSettings);

module.exports = router;