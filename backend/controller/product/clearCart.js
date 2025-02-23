// const deleteProductPermission = require('../../helpers/permission');
const cartModel = require('../../models/cartProduct');
const jwt = require('jsonwebtoken');


async function clearCart(req, res) {
    const jwtSecret = process.env.TOKEN_SECRET_KEY;

    try {
        // Extract userId from the token
        const token = req.headers.authorization.split(' ')[1]; // Assuming Bearer token format
        const decodedToken = jwt.verify(token, jwtSecret); // Use your JWT secret key
        const userId = decodedToken._id;

        // Now delete all cart items for this userId
        const result = await cartModel.deleteMany({ userId });

        res.status(200).json({ success: true, message: "Cart cleared successfully" });
      } catch (error) {
        console.error("Token Verification Error:", error.message); // Log specific error message

        res.status(401).json({ success: false, message: "Unauthorized" });
      }
}   

module.exports = clearCart;
