const pool = require('../config/database');

class SheetAnalysis {
    //Save analysis result
    static async create(userId, analysisData) {
        const {
            key_signature,
            tempo,
            time_signature,
            difficulty,
            techniques,
            recommendations,
            image_url,
        } = analysisData;

        const query = `
            INSERT INTO sheet_analyses 
                (user_id, key_signature, tempo, time_signature, difficulty, 
                 techniques, recommendations, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;

        try {
            const result = await pool.query(query, [
                userId,
                key_signature,
                tempo || null,
                time_signature || null,
                difficulty || null,
                JSON.stringify(techniques || []),
                JSON.stringify(recommendations || []),
                image_url || null
            ]);
            return result.rows[0];

        } catch (error) {
            throw error;
        }
    }

    // get all analyses for user
    static async findByUserId(userId) {
        const query = `
            SELECT * FROM sheet_analyses
            WHERE user_id = $1
            ORDER BY created_at DESC
        `;

        try {
            const result = await pool.query(query, [userId]);
            // Parse JSON fields
            return result.rows.map(row => ({
                ...row,
                techniques: JSON.parse(row.techniques || '[]'),
                recommendations: JSON.parse(row.recommendations || '[]')
            }));
        } catch (error) {
            throw error;
        }
    }

    // get single analysis 
    static async findById(analysisId) {
        const query = `
            SELECT * FROM sheet_analyses
            WHERE id = $1
        `;

        try {
            const result = await pool.query(query, [analysisId]);
            if (result.rows.length === 0) return null;

            const row = result.rows[0];
            return {
                ...row,
                techniques: JSON.parse(row.techniques || '[]'),
                recommendations: JSON.parse(row.recommendations || '[]')
            };
        } catch (error) {
            throw error;
        }
    }

    // delete analysis
    static async delete(analysisId) {
        const query = 'DELETE FROM sheet_analyses WHERE id = $1 RETURNING id';

        try {
            const result = await pool.query(query, [analysisId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

}

module.exports = SheetAnalysis;