const pool = require('../config/database');

class SessionItem {
    // Create a new session item
    static async create(sessionId, itemData) {
        const { item_type, item_name, tempo_bpm, time_spent_minutes, difficulty_level, notes } = itemData;

        const query = `
            INSERT INTO session_items 
                (session_id, item_type, item_name, tempo_bpm, time_spent_minutes, difficulty_level, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, session_id, item_type, item_name, tempo_bpm, time_spent_minutes, difficulty_level, notes, created_at
            `;

        try {
            const result = await pool.query(query, [
                sessionId,
                item_type,
                item_name,
                tempo_bpm,
                time_spent_minutes,
                difficulty_level,
                notes
            ]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get all items from a specific session
    static async findBySessionId(sessionId) {
        const query = `
            SELECT 
                id, session_id, item_type, item_name, 
                tempo_bpm, time_spent_minutes, difficulty_level, notes, created_at
            FROM session_items
            WHERE session_id = $1
            ORDER BY created_at ASC
            `;

        try {
            const result = await pool.query(query, [sessionId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Get a single item by ID
    static async findById(itemId) {
        const query = `
            SELECT 
                id, session_id, item_type, item_name,
                tempo_bpm, time_spent_minutes, difficulty_level, notes, created_at
            FROM session_items
            WHERE id = $1
            `;

        try {
            const result = await pool.query(query, [itemId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Update a session item
    static async update(itemId, itemData) {
        const { item_type, item_name, tempo_bpm, time_spent_minutes, difficulty_level, notes } = itemData;
        
        const query = `
            UPDATE session_items
            SET 
                item_type = $1,
                item_name = $2,
                tempo_bpm = $3,
                time_spent_minutes = $4,
                difficulty_level = $5,
                notes = $6
            WHERE id = $7
            RETURNING id, session_id, item_type, item_name, tempo_bpm, time_spent_minutes, difficulty_level, notes, created_at
            `;
        
        try {
            const result = await pool.query(query, [
                item_type,
                item_name,
                tempo_bpm,
                time_spent_minutes,
                difficulty_level,
                notes,
                itemId
            ]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Delete a session item
    static async delete(itemId) {
        const query = 'DELETE FROM session_items WHERE id = $1 RETURNING id';
        
        try {
            const result = await pool.query(query, [itemId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

}

module.exports = SessionItem;