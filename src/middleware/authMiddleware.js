// **Headers** are metadata sent with every HTTP request:
// ```
// GET /api/sessions
// Host: localhost:3000
// Content-Type: application/json
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

const jwt = require('jsonwebtoken');

//middleware to verify jwt token
exports.authenticate = (req, res, next) => {
    try {
        //get token from Authorization Header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        //extract the token from "Bearer TOKEN" format
        const token = authHeader.split(' ')[1]; // → ["Bearer", "TOKEN"]

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token format'
            });
        }

        //verify token
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        //attach user info to request object (Now controller can use this info from the req)
        req.userId = decode.userId;
        req.userEmail = decode.userEmail;

        //continue to next middleware/controller 
        //tells Express to continue to the next middleware/controller
        next();

    } catch (error) {
        //token is invalid or expired
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token has expired'
            });
        }

        return res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }
}