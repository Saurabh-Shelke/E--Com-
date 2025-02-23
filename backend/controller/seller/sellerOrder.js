const orderModel = require("../../models/order");

const sellerOrder = async (req, res) => {
    try {
        const { sellerId } = req.query;

        // Find orders where the products contain the seller's products
        const result = await orderModel.deleteMany({ status: "created" });

        const orders = await orderModel
            .find({ "products.productId": { $exists: true } })
            .populate({
                path: 'products.productId',
                match: { sellerId }, // Filter products by sellerId
                select: 'productName price', // Select fields to return
            })
            .populate('userId', 'name') // Populate user details
            .sort({ createdAt: -1 }) // Sort in descending order
            .exec();

        // Filter out orders where no products belong to the seller
        const filteredOrders = orders.filter(order =>
            order.products.some(product => product.productId) // Check if any products match sellerId
        );

        res.json({ success: true, orders: filteredOrders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};

module.exports = sellerOrder;
