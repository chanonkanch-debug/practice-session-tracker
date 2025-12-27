const SessionItem = require('../models/SessionItem');
const PracticeSession = require('../models/PracticeSession');

// Add item to a session
exports.addItem = async (req, res) => {
    try {
        // 1. get session id from url parameter
        const sessionId = req.params.sessionId;

        // validate sessionId
        if (isNaN(sessionId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid sessionId'
            });
        }
        // 2. verify session exists and belongs to user
        const session = await PracticeSession.findById(sessionId);
        
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }
        if (session.user_id !== req.userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to add items to this session'
            });
        }

        // 3. Extract item data from request body
        const { 
            item_type, 
            item_name, 
            tempo_bpm, 
            time_spent_minutes, 
            difficulty_level, 
            notes,
            lap_number,        // NEW
            started_at,    // NEW
            ended_at       // NEW
        } = req.body;

        // Validate required fields
        if (!item_type || !item_name) {
            return res.status(400).json({
                success: false,
                error: 'Item type and name are required'
            });
        }

        // Validate item_type
        const allowedTypes = ['scale', 'piece', 'technique', 'exercise', 'warmup', 'other'];
        if (!allowedTypes.includes(item_type.toLowerCase())) {
            return res.status(400).json({
                success: false,
                error: `Item type must be one of: ${allowedTypes.join(', ')}`
            });
        }

        // Validate time_spent_minutes (UPDATED - allow 0 for very short laps)
        if (time_spent_minutes !== undefined && time_spent_minutes !== null) {
            if (isNaN(time_spent_minutes) || time_spent_minutes < 0) {  // Changed from <= 0 to < 0
                return res.status(400).json({
                success: false,
                error: 'Time spent cannot be negative'
                });
            }
            // TODO: Add a reasonable upper limit (time_spent_minutes cannot exceeds the sessionTime)
            if (time_spent_minutes > 480) {
                return res.status(400).json({
                success: false,
                error: 'Time spent cannot exceed the overall session duration'
                });
            }
        }

        // Validate tempo_bpm (if provided)
        if (tempo_bpm !== undefined && tempo_bpm !== null) {
            if (tempo_bpm <= 0 || isNaN(tempo_bpm)) {
                return res.status(400).json({
                success: false,
                error: 'Tempo must be a positive number'
                });
            }
        }

        // Validate difficulty_level (if provided)
        const allowedDifficulties = ['beginner', 'intermediate', 'advanced'];  
            if (difficulty_level && !allowedDifficulties.includes(difficulty_level.toLowerCase())) {
                return res.status(400).json({
                    success: false,
                    error: `Difficulty level must be one of: ${allowedDifficulties.join(', ')}`
            });
        }

        // Validate notes
        if (notes !== undefined && notes !== null) {
            if (typeof notes !== 'string') {
                return res.status(400).json({
                success: false,
                error: 'Notes must be a string'
                });
            }
            // Add a maximum length to prevent abuse
            if (notes.length > 1000) {
                return res.status(400).json({
                success: false,
                error: 'Notes cannot exceed 1000 characters'
                });
            }
        }

        // 4. Prepare item data (UPDATED - include new lap fields)
        const itemData = {
            item_type: item_type.toLowerCase(),
            item_name,
            tempo_bpm: tempo_bpm || null,
            time_spent_minutes,
            difficulty_level: difficulty_level ? difficulty_level.toLowerCase() : null,
            notes: notes || null,
            lap_number: lap_number || null,        // NEW
            started_at: started_at || null, // NEW
            ended_at: ended_at || null      // NEW
        }

        // 5. Create item in database
        const newItem = await SessionItem.create(sessionId, itemData);

        // return success response
        res.status(201).json({
            success: true,
            message: 'Item added to session successfully',
            item: newItem
        });

    } catch (error) {
        console.error('Add item error:', error);
            res.status(500).json({
            success: false,
            error: 'Server error while adding item'
        });
    }
}

// Get all items for a session (UPDATED - use ordered by lap)
exports.getSessionItems = async (req, res) => {
    try {
        // 1. Get session id from url params
        const sessionId = req.params.sessionId;

        // Validate the session id
        if (isNaN(sessionId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid session ID'
            });
        }

        // 2. verify if session exist and belongs to user
        const session = await PracticeSession.findById(sessionId);

        // Valudate session
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }

        if (session.user_id !== req.userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to view items for this session'
            });
        }

        // 3. get all items for this session (UPDATED - use ordered method)
        const items = await SessionItem.findBySessionIdOrderedByLap(sessionId);

        res.status(200).json({
            success: true,
            count: items.length,
            items: items
        });

    } catch (error) {
        console.error('Get session items error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching items'
        });
    }
};

// Update a session item (UPDATED - handle new lap fields)
exports.updateItem = async (req, res) => {
    try {
        // 1. Get IDs from url params
        const sessionId = req.params.sessionId;
        const itemId = req.params.itemId;

        // Validate both ids
        if (isNaN(sessionId) || isNaN(itemId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid session or item ID'
            });
        }

        // 3. verify session exists and belongs to user
        const session = await PracticeSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }
        if (session.user_id !== req.userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update items in this session'
            });
        }

        // 4. Verify item exists and belongs to the session
        const existingItem = await SessionItem.findById(itemId);

        // Validate existing item
        if (!existingItem) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }
        if (parseInt(existingItem.session_id) !== parseInt(sessionId)) {
            return res.status(400).json({
                success: false,
                message: 'ExistingItem SessionId: ' + existingItem.session_id + ', SessionID: '+ sessionId,
                error: 'Item does not belong to this session'
            });
        }

        // 5. extract update data (support partial updates) - UPDATED with new fields
        const { 
            item_type, 
            item_name, 
            tempo_bpm, 
            time_spent_minutes, 
            difficulty_level, 
            notes,
            lap_number,       // NEW
            started_at,   // NEW
            ended_at      // NEW
        } = req.body;

        // 6. prepare updated data (UPDATED - include new lap fields)
        const updatedData = {
            item_type: item_type !== undefined ? item_type.toLowerCase() : existingItem.item_type,
            item_name: item_name !== undefined ? item_name : existingItem.item_name,
            tempo_bpm: tempo_bpm !== undefined ? tempo_bpm : existingItem.tempo_bpm,
            time_spent_minutes: time_spent_minutes !== undefined ? time_spent_minutes : existingItem.time_spent_minutes,
            difficulty_level: difficulty_level !== undefined 
                ? (difficulty_level ? difficulty_level.toLowerCase() : null)
                : existingItem.difficulty_level,
            notes: notes !== undefined ? notes : existingItem.notes,
            lap_number: lap_number !== undefined ? lap_number : existingItem.lap_number,           // NEW
            started_at: started_at !== undefined ? started_at : existingItem.started_at, // NEW
            ended_at: ended_at !== undefined ? ended_at : existingItem.ended_at      // NEW
        };

        // Validate updated data
        const allowedTypes = ['scale', 'piece', 'technique', 'exercise', 'warmup', 'other'];
            if (!allowedTypes.includes(updatedData.item_type)) {
            return res.status(400).json({
                success: false,
                error: `Item type must be one of: ${allowedTypes.join(', ')}`
            });
        }

        if (updatedData.tempo_bpm !== null && (updatedData.tempo_bpm <= 0 || isNaN(updatedData.tempo_bpm))) {
            return res.status(400).json({
                success: false,
                error: 'Tempo must be a positive number'
            });
        }

        const allowedDifficulties = ['beginner', 'intermediate', 'advanced'];  
        if (updatedData.difficulty_level && !allowedDifficulties.includes(updatedData.difficulty_level)) {
            return res.status(400).json({
                success: false,
                error: `Difficulty level must be one of: ${allowedDifficulties.join(', ')}`
            });
        }

        // 8. update item in database
        const updatedItem = await SessionItem.update(itemId, updatedData);

        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            item: updatedItem
        });

    } catch (error) {
        console.error('Updated item error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while updating item'
        });
    }
}

// Delete a session item (NO CHANGES NEEDED)
exports.deleteItem = async (req, res) => {
    try {
        // 1. Get both ids
        const sessionId = req.params.sessionId;
        const itemId = req.params.itemId;

        // validate ids
        if (isNaN(sessionId) || isNaN(itemId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid session or item ID'
            });
        }

        // 3. Verify session exists and belongs to user
        const session = await PracticeSession.findById(sessionId);
        
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }
        if (session.user_id !== req.userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete items from this session'
            });
        }

        // 4. Verify item exists and belongs to this session
        const existingItem = await SessionItem.findById(itemId);
        
        if (!existingItem) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }
        if (parseInt(existingItem.session_id) !== parseInt(sessionId)) {
            return res.status(400).json({
                success: false,
                error: 'Item does not belong to this session'
            });
        }

        // 5. Delete item from database
        await SessionItem.delete(itemId);

        // 6. Return success response
        res.status(200).json({
            success: true,
            message: 'Item deleted successfully'
        });

    } catch (error) {
        console.error('Delete item error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while deleting item'
        });
    }
};