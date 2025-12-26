const pool = require('../config/database');

class PracticeSession {

    // create a new practice session
    static async create(userId, sessionData) {
        const { 
            practice_date, 
            total_duration, 
            instrument, 
            session_notes,
            actual_duration,      // NEW
            status,               // NEW
            started_at,           // NEW
            completed_at          // NEW
        } = sessionData;

        const query = `
            INSERT INTO practice_sessions 
                (user_id, practice_date, total_duration, instrument, session_notes,
                 actual_duration, status, started_at, completed_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, user_id, practice_date, total_duration, instrument, session_notes, 
                      actual_duration, status, started_at, completed_at, created_at, updated_at
            `;

        try {
            const result = await pool.query(query, [
                userId,
                practice_date,
                total_duration,
                instrument,
                session_notes,
                actual_duration || null,           // NEW - optional
                status || 'completed',             // NEW - default to 'completed'
                started_at || null,                // NEW - optional
                completed_at || null               // NEW - optional
            ]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // get all sessions for a specific user
    static async findAllUserId(userId) {
        const query = `
        SELECT 
            id, user_id, practice_date, total_duration, 
            instrument, session_notes, 
            actual_duration, status, started_at, completed_at,
            created_at, updated_at
            FROM practice_sessions
            WHERE user_id = $1
            ORDER BY practice_date DESC, created_at DESC
            `;

        try {
            const result = await pool.query(query, [userId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // get a single session by ID
    static async findById(sessionId) {
        const query = `
        SELECT 
            id, user_id, practice_date, total_duration, 
            instrument, session_notes,
            actual_duration, status, started_at, completed_at,
            created_at, updated_at
            FROM practice_sessions
            WHERE id = $1
        `;
    
        try {
            const result = await pool.query(query, [sessionId]);
            return result.rows[0]; // Returns undefined if not found
        } catch (error) {
            throw error;
        }
    }

    // verify ownership of the session. If it belongs to a specific user
    static async verifyOwnership(sessionId, userId) {
        const query = `
            SELECT id FROM practice_sessions
            WHERE id = $1 AND user_id = $2
            `;

        try {
            const result = await pool.query(query, [sessionId, userId]);
            return result.rows.length > 0; // returns true if session is belong to the user
        } catch (error) {
            throw error;
        }
    }

    // UPDATE practice sessions
    static async update(sessionId, sessionData) {
        const { 
            practice_date, 
            total_duration, 
            instrument, 
            session_notes,
            actual_duration,      // NEW
            status,               // NEW
            started_at,           // NEW
            completed_at          // NEW
        } = sessionData;

        const query = `
            UPDATE practice_sessions
            SET 
                practice_date = COALESCE($1, practice_date),
                total_duration = COALESCE($2, total_duration),
                instrument = COALESCE($3, instrument),
                session_notes = COALESCE($4, session_notes),
                actual_duration = COALESCE($5, actual_duration),
                status = COALESCE($6, status),
                started_at = COALESCE($7, started_at),
                completed_at = COALESCE($8, completed_at),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $9
            RETURNING id, user_id, practice_date, total_duration, instrument, session_notes,
                      actual_duration, status, started_at, completed_at, created_at, updated_at
            `;

        try {
            const result = await pool.query(query, [
                practice_date,
                total_duration,
                instrument,
                session_notes,
                actual_duration,      // NEW
                status,               // NEW
                started_at,           // NEW
                completed_at,         // NEW
                sessionId
            ]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // DELETE practice sessions
    static async delete(sessionId) {
        const query = 'DELETE FROM practice_sessions WHERE id = $1 RETURNING id';

        try {
            const result = await pool.query(query, [sessionId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get session with its items
    static async findByIdWithItems(sessionId) {
        // get the session
        const sessionQuery = `
            SELECT 
                id, user_id, practice_date, total_duration, 
                instrument, session_notes,
                actual_duration, status, started_at, completed_at,
                created_at, updated_at
            FROM practice_sessions
            WHERE id = $1
            `;
        
        // then get its items
        const itemsQuery = `
            SELECT 
                id, session_id, item_type, item_name, time_spent_minutes, 
                tempo_bpm, difficulty_level, notes,
                lap_number, lap_started_at, lap_ended_at,
                created_at
            FROM session_items
            WHERE session_id = $1
            ORDER BY lap_number ASC, created_at ASC
            `;

        try {
            const sessionResult = await pool.query(sessionQuery, [sessionId]);
            const session = sessionResult.rows[0];

            if (!session) {
                return null;
            }

            const itemsResult = await pool.query(itemsQuery, [sessionId]);
            session.items = itemsResult.rows;
            
            return session;
        } catch (error) {
            throw error;
        }
    }

    // NEW: Get active session for a user (status = 'active' or 'paused')
    static async findActiveSession(userId) {
        const query = `
            SELECT 
                id, user_id, practice_date, total_duration, 
                instrument, session_notes,
                actual_duration, status, started_at, completed_at,
                created_at, updated_at
            FROM practice_sessions
            WHERE user_id = $1 AND status IN ('active', 'paused')
            ORDER BY started_at DESC
            LIMIT 1
        `;

        try {
            const result = await pool.query(query, [userId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // NEW: Update session status
    static async updateStatus(sessionId, status) {
        const query = `
            UPDATE practice_sessions
            SET 
                status = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING id, user_id, practice_date, total_duration, instrument, session_notes,
                      actual_duration, status, started_at, completed_at, created_at, updated_at
        `;

        try {
            const result = await pool.query(query, [status, sessionId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

}

module.exports = PracticeSession;