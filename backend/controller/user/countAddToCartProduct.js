const addToCartModel = require("../../models/cartProduct")

const countAddToCartProduct = async (req, res) => {
    try {
        const userId = req.userId;

        // Check if userId is present
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                error: true,
                success: false,
            });
        }

        const count = await addToCartModel.countDocuments({
            userId: userId
        });

        res.status(200).json({
            data: {
                count: count
            },
            message: "ok",
            error: false,
            success: true
        });
    } catch (error) {
        console.error('Error counting cart products:', error); // Log the error for debugging
        res.status(500).json({
            message: error.message || 'Internal Server Error',
            error: true,
            success: false,
        });
    }
};

module.exports = countAddToCartProduct;
