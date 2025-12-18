const pool = require('../config/database');

class PracticeSession {

    // create a new practice session
    static async create(userId, sessionData) {
        const { practice_date, total_duration, instrument, session_notes } = sessionData;

        const query = `
            INSERT INTO practice_sessions 
                (user_id, practice_date, total_duration, instrument, session_notes)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, user_id, practice_date, total_duration, instrument, session_notes, created_at, updated_at
            `;

        try {
            const result = await pool.query(query, [
                userId,
                practice_date,
                total_duration,
                instrument,
                session_notes
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
            instrument, session_notes, created_at, updated_at
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

    // get a sinle session by ID
    static async findById(sessionId) {
        const query = `
        SELECT 
            id, user_id, practice_date, total_duration, 
            instrument, session_notes, created_at, updated_at
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
        const { practice_date, total_duration, instrument, session_notes } = sessionData;

        const query = `
            UPDATE practice_sessions
            SET 
                practice_date = $1,
                total_duration = $2,
                instrument = $3,
                session_notes = $4,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING id, user_id, practice_date, total_duration, instrument, session_notes, created_at, updated_at
            `;

        try {
            const result = await pool.query(query, [
                practice_date,
                total_duration,
                instrument,
                session_notes,
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

}

module.exports = PracticeSession;