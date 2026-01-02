const pool = require('../config/database');

class User {

    // create new user
    static async create(email, passwordHash, username) {
        const query =
            `
        INSERT INTO users (email, password_hash, username) 
        VALUES ($1, $2, $3)
        RETURNING id, email, username, created_at
        `;

        try {
            const result = await pool.query(query, [email, passwordHash, username]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // find user by email
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';

        try {
            const result = await pool.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // find user by username
    static async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';

        try {
            const result = await pool.query(query, [username]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // find user by id
    static async findById(id) {
        const query = 'SELECT id, email, username, created_at FROM users WHERE id = $1';

        try {
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // update user profile
    static async updateProfile(userId, updates) {
        const { username, email } = updates;

        const query = `
            UPDATE users
            SET 
                username = COALESCE($1, username),
                email = COALESCE($2, email)
            WHERE id = $3
            RETURNING id, username, email, created_at
        `;

        try {
            const result = await pool.query(query, [username, email, userId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // update user settings and preferences
    static async updateSettings(userId, settings) {
        const { notifications_enabled, practice_goal_minutes } = settings;

        // First, check if settings exist
        const checkQuery = `SELECT * FROM user_settings WHERE user_id = $1`;
        const checkResult = await pool.query(checkQuery, [userId]);

        if (checkResult.rows.length === 0) {
            // Create new settings
            const insertQuery = `
                INSERT INTO user_settings (user_id, notifications_enabled, practice_goal_minutes)
                VALUES ($1, $2, $3)
                RETURNING *
            `;

            try {
                const result = await pool.query(insertQuery, [
                    userId,
                    notifications_enabled !== undefined ? notifications_enabled : true,
                    practice_goal_minutes || 30
                ]);
                return result.rows[0];
            } catch (error) {
                throw error;
            }
        } else {
            // Update existing settings
            const updateQuery = `
                UPDATE user_settings
                SET 
                    notifications_enabled = COALESCE($1, notifications_enabled),
                    practice_goal_minutes = COALESCE($2, practice_goal_minutes)
                WHERE user_id = $3
                RETURNING *
            `;

            try {
                const result = await pool.query(updateQuery, [
                    notifications_enabled,
                    practice_goal_minutes,
                    userId
                ]);
                return result.rows[0];
            } catch (error) {
                throw error;
            }
        }
    }

    // get user settings
    static async getSettings(userId) {
        const query = `SELECT * FROM user_settings WHERE user_id = $1`;

        try {
            const result = await pool.query(query, [userId]);

            // if no settings exist, return defaults
            if (result.rows.length === 0) {
                return {
                    user_id: userId,
                    notifications_enabled: true,
                    practice_goal_minutes: 30
                };
            }

            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

}

module.exports = User;