const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        // Get token from cookies or Authorization header
        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: "Please Login...!",
                error: true,
                success: false,
                redirectToLogin: true 
            });
        }

        // Verify the JWT token
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
            if (err) {
                // Check if the error is due to an expired token
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        message: "Session expired. Please login again.",
                        error: true,
                        success: false,
                        redirectToLogin: true,
                        expired: true // Optional flag for front-end handling
                    });
                }
                console.log("JWT verification error:", err);
                return res.status(401).json({
                    message: "Authentication failed. Please login.",
                    error: true,
                    success: false,
                    redirectToLogin: true
                });
            }

            // Set user id to request object if token is valid
            req.userId = decoded?._id;
            next();
        });

    } catch (err) {
        // Handle unexpected errors gracefully
        res.status(400).json({
            message: err.message || err,
            data: [],
            error: true,
            success: false
        });
    }
}

module.exports = authToken;
