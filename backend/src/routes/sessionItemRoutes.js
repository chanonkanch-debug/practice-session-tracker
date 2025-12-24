const express = require('express');
const router = express.Router({ mergeParams: true }); // IMPORTANT!!
const sessionItemController = require('../controllers/sessionItemController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware.authenticate);

// POST /api/sessions/:sessionId/items - Add item to session
router.post('/', sessionItemController.addItem);

// GET /api/sessions/:sessionId/items - Get all items for session
router.get('/', sessionItemController.getSessionItems);

// PUT /api/sessions/:sessionId/items/:itemId - Update item
router.put('/:itemId', sessionItemController.updateItem);

// DELETE /api/sessions/:sessionId/items/:itemId - Delete item
router.delete('/:itemId', sessionItemController.deleteItem);

module.exports = router;