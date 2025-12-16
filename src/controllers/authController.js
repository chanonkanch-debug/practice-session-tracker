const bcrypt = require('bcrypt');
const User = require('../models/Users');

// Register new user
exports.register = async (req, res) => {

    try {
        // Extract data from request body
        const { email, username, password } = req.body;

        // Validate input
        if (!email || !username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email, username, password are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        // Validate password
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters long'
            });
        }

        // Check if email already exist
        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({
                success: false, 
                error: 'Email already exists'
            });
        }

        // Check if username already exist
        const existingUsername = await User.findByUsername(username);
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                error: 'Username already taken'
            });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user in database
        const newUser = await User.create(email, passwordHash, username);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                createdAt: newUser.created_at
            }
        });

    } catch (error) {
        console.error('Registration error: ', error);
        res.status(500).json({
            success: false,
            error: 'Server error during registration'
        })
    }
}