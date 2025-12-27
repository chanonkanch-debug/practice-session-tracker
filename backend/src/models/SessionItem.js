const pool = require('../config/database');

class SessionItem {
    // Create a new session item
    static async create(sessionId, itemData) {
        const { 
            item_type, 
            item_name, 
            tempo_bpm, 
            time_spent_minutes, 
            difficulty_level, 
            notes,
            lap_number,          // NEW
            started_at,      // NEW
            ended_at         // NEW
        } = itemData;

        const query = `
            INSERT INTO session_items 
                (session_id, item_type, item_name, tempo_bpm, time_spent_minutes, 
                 difficulty_level, notes, lap_number, started_at, ended_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, session_id, item_type, item_name, tempo_bpm, time_spent_minutes, 
                      difficulty_level, notes, lap_number, started_at, ended_at, created_at
            `;

        try {
            const result = await pool.query(query, [
                sessionId,
                item_type,
                item_name,
                tempo_bpm,
                time_spent_minutes,
                difficulty_level,
                notes,
                lap_number || null,         // NEW - optional
                started_at || null,     // NEW - optional
                ended_at || null        // NEW - optional
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
                tempo_bpm, time_spent_minutes, difficulty_level, notes,
                lap_number, started_at, ended_at, created_at
            FROM session_items
            WHERE session_id = $1
            ORDER BY lap_number ASC, created_at ASC
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
                tempo_bpm, time_spent_minutes, difficulty_level, notes,
                lap_number, started_at, ended_at, created_at
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
        const { 
            item_type, 
            item_name, 
            tempo_bpm, 
            time_spent_minutes, 
            difficulty_level, 
            notes,
            lap_number,          // NEW
            started_at,      // NEW
            ended_at         // NEW
        } = itemData;
        
        const query = `
            UPDATE session_items
            SET 
                item_type = COALESCE($1, item_type),
                item_name = COALESCE($2, item_name),
                tempo_bpm = COALESCE($3, tempo_bpm),
                time_spent_minutes = COALESCE($4, time_spent_minutes),
                difficulty_level = COALESCE($5, difficulty_level),
                notes = COALESCE($6, notes),
                lap_number = COALESCE($7, lap_number),
                tarted_at = COALESCE($8, started_at),
                ended_at = COALESCE($9, lap_ended_at)
            WHERE id = $10
            RETURNING id, session_id, item_type, item_name, tempo_bpm, time_spent_minutes, 
                      difficulty_level, notes, lap_number, started_at, ended_at, created_at
            `;
        
        try {
            const result = await pool.query(query, [
                item_type,
                item_name,
                tempo_bpm,
                time_spent_minutes,
                difficulty_level,
                notes,
                lap_number,         // NEW
                started_at,     // NEW
                ended_at,       // NEW
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

    // NEW: Get items for a session ordered by lap
    static async findBySessionIdOrderedByLap(sessionId) {
        const query = `
            SELECT 
                id, session_id, item_type, item_name, 
                tempo_bpm, time_spent_minutes, difficulty_level, notes,
                lap_number, started_at, ended_at, created_at
            FROM session_items
            WHERE session_id = $1
            ORDER BY lap_number ASC NULLS LAST, created_at ASC
            `;

        try {
            const result = await pool.query(query, [sessionId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // NEW: Get next lap number for a session
    static async getNextLapNumber(sessionId) {
        const query = `
            SELECT COALESCE(MAX(lap_number), 0) + 1 as next_lap_number
            FROM session_items
            WHERE session_id = $1
        `;

        try {
            const result = await pool.query(query, [sessionId]);
            return result.rows[0].next_lap_number;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = SessionItem;