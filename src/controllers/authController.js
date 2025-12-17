const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

// User Login
exports.login = async (req, res) => {
    try {
        //extract data from request body
        const { email, password } = req.body;

        //validate inputs
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        //find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email of password (TESTING: Cannot find user email)'
            });
        }

        //verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password (TESTING: Password verification failed)'
            });
        }

        //generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email }, // payload
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // options
        )

        //return success response with token
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        });
        
    } catch (error) {
        console.error('Login error: ', error);
        res.status(500).json({
            success: false,
            error: 'Server error during login'
        });
    }
}

// get current user (protected route)
exports.getCurrentUser = async (req, res) => {
    try {
        //req.userId is set by authMiddleware (by authenticating jwt token)
        //know exactly which user is making the request (can return their specific data)
        const user = await User.findById(req.userId); 

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
}