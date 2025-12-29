const pool = require('../config/database');

class Stats {

    // Get total practice time for a user with a timeframe
    static async getTotalPracticeTime(userId, startDate = null, endDate = null) {
        let query = `
            SELECT 
                COALESCE(SUM(COALESCE(actual_duration, total_duration)), 0) as total_minutes,
                COUNT(*) as session_count,
                COALESCE(AVG(COALESCE(actual_duration, total_duration)), 0) as avg_session_duration
            FROM practice_sessions
            WHERE user_id = $1
        `;

        const params = [userId];

        // if start and end date included, only sum the total between the date range given
        // otherwise, give total of the account
        if (startDate) {
            query += ` AND practice_date >= $2`;
            params.push(startDate);
        }
        if (endDate) {
            query += ` AND practice_date <= $${params.length + 1}`;
            params.push(endDate);
        }

        try {
            const result = await pool.query(query, params);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get current practice streak (consecutive days)
    static async getPracticeStreak(userId) {
        const query = `
        WITH daily_practice AS (
            SELECT DISTINCT practice_date
            FROM practice_sessions
            WHERE user_id = $1
                AND COALESCE(actual_duration, total_duration) > 0
            ORDER BY practice_date DESC
        ),
        streak_check AS (
            SELECT
                practice_date,
                practice_date - ROW_NUMBER() OVER (ORDER BY practice_date DESC)::int AS streak_group
            FROM daily_practice
        )
        SELECT COUNT(*) as streak
        FROM streak_check
        WHERE streak_group = (
            SELECT streak_group
            FROM streak_check
            LIMIT 1
        )
        `;

        try {
            const result = await pool.query(query, [userId]);
            return result.rows[0]?.streak || 0;
        } catch (error) {
            throw error;
        }
    }

    // Get consistency score (percentage of days practiced in timeframe)
    static async getConsistencyScore(userId, days = 30) {
        const query = `
        WITH date_range AS (
            SELECT CURRENT_DATE - $2::int as start_date
        ),
        practice_days AS (
            SELECT COUNT(DISTINCT practice_date) as days_practiced
            FROM practice_sessions
            WHERE user_id = $1
                AND practice_date >= (SELECT start_date FROM date_range)
                AND COALESCE(actual_duration, total_duration) > 0
        )
        SELECT
            days_practiced,
            $2 as total_days,
            ROUND((days_practiced::numeric / $2) * 100, 1) as consistency_percentage
        FROM practice_days
        `;

        try {
            const result = await pool.query(query, [userId, days]);
            return result.rows[0];
        } catch (error) {
            throw(error);
        }
    }

    // Get most practiced items (top-item) 
    static async getTopItems(userId, limit = 10) {
        const query = `
            SELECT
                si.item_name,
                si.item_type,
                COUNT(*) as practice_count,
                AVG(si.tempo_bpm)::int as avg_tempo,
                SUM(si.time_spent_minutes) as total_time
            FROM session_items si
            JOIN practice_sessions ps ON si.session_id = ps.id
            WHERE ps.user_id = $1
                AND si.item_name IS NOT NULL
            GROUP BY si.item_name, si.item_type
            ORDER BY practice_count DESC, total_time DESC
            LIMIT $2
        `;

        try {
            const result = await pool.query(query, [userId, limit]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Get tempo-progression for a specific item
    static async getTempoProgression(userId, itemName) {
        const query = `
            SELECT
                ps.practice_date,
                si.tempo_bpm,
                si.difficulty_level,
                si.time_spent_minutes
            FROM session_items si
            JOIN practice_sessions ps ON si.session_id = ps.id
            WHERE ps.user_id = $1
                AND si.item_name = $2
                AND si.tempo_bpm IS NOT NULL
            ORDER BY ps.practice_date ASC
        `;

        try {
            const result = await pool.query(query, [userId, itemName]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Get session trends
    static async getSessionTrends(userId, weeks = 12) {
        const query = `
            SELECT
                DATE_TRUNC('week', practice_date) as week_start,
                COUNT(*) as session_count,
                ROUND(AVG(COALESCE(actual_duration, total_duration))::numeric, 1) as avg_duration,
                SUM(COALESCE(actual_duration, total_duration)) as total_minutes
            FROM practice_sessions
            WHERE user_id = $1
                AND practice_date >= CURRENT_DATE - ($2 * 7)
            GROUP BY DATE_TRUNC('week', practice_date)
            ORDER BY week_start DESC
        `;

        try {
            const result = await pool.query(query, [userId, weeks]);
            return result.rows;
        } catch(error) {
            throw error;
        }
    }

    // Get instrument breakdown
    static async getInstrumentBreakdown(userId) {
        const query = `
            SELECT
                LOWER(COALESCE(instrument, 'not specified')) as instrument,
                COUNT(*) as session_count,
                SUM(COALESCE(actual_duration, total_duration)) as total_minutes,
                ROUND(AVG(COALESCE(actual_duration, total_duration))::numeric, 1) as avg_duration
            FROM practice_sessions
            WHERE user_id = $1
            GROUP BY LOWER(COALESCE(instrument, 'not specified'))
            ORDER BY total_minutes DESC
        `;

        try {
            const result = await pool.query(query, [userId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = Stats;