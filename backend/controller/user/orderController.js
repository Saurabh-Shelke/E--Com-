const orderModel = require("../../models/order");

const orderController = async (req, res) => {
    try {
        const result = await orderModel.deleteMany({ status: "created" });

        // Fetch all orders from the database
        const orders = await orderModel
            .find() // Fetch all orders without any filtering
            .populate('products.productId', 'productName price') // Populate product details
            .populate('userId', 'name') // Populate user details
            .sort({ createdAt: -1 }) // Sort orders by creation date (newest first)
            .exec();

        res.json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};

module.exports = orderController;
