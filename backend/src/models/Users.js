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
}

module.exports = User;