// Middleware for seller authentication
const jwt = require('jsonwebtoken');

async function authSellerToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from header
    if (!token) return res.status(403).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.SELLER_TOKEN_SECRET_KEY);
        req.userId = verified._id; // Store user ID in req object
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
}
module.exports = authSellerToken;
