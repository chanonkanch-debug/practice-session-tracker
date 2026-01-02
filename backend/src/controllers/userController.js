const User = require('../models/Users');

// get current user profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching profile'
        });
    }
}

// update user profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { username, email } = req.body;

        // Validation
        if (!username && !email) {
            return res.status(400).json({
                success: false,
                error: 'Provide at least one field to update'
            });
        }

        // Validate email format if provided
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid email format'
                });
            }

            // Check if email already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({
                    success: false,
                    error: 'Email already in use'
                });
            }
        }

        // Validate username if provided
        if (username) {
            if (username.length < 3 || username.length > 30) {
                return res.status(400).json({
                    success: false,
                    error: 'Username must be between 3 and 30 characters'
                });
            }

            // Check if username already exists
            const existingUser = await User.findByUsername(username);
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({
                    success: false,
                    error: 'Username already taken'
                });
            }
        }

        const updatedUser = await User.updateProfile(userId, { username, email });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while updating profile'
        });
    }
}

// get user settings
exports.getSettings = async (req, res) => {
    try {
        const userId = req.userId;

        const settings = await User.getSettings(userId);

        res.status(200).json({
            success: true,
            settings
        });

    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching settings'
        });
    }
}

// update user settings
exports.updateSettings = async (req, res) => {
    try {
        const userId = req.userId;
        const { notifications_enabled, practice_goal_minutes } = req.body;

        // Validation
        if (practice_goal_minutes !== undefined) {
            if (isNaN(practice_goal_minutes) || practice_goal_minutes < 1 || practice_goal_minutes > 480) {
                return res.status(400).json({
                    success: false,
                    error: 'Practice goal must be between 1 and 480 minutes'
                });
            }
        }

        const updatedSettings = await User.updateSettings(userId, {
            notifications_enabled,
            practice_goal_minutes
        });

        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            settings: updatedSettings
        });

    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while updating settings'
        });
    }
}