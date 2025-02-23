const addToCartModel = require("../../models/cartProduct");
const Product  = require("../../models/productModel")

const buyNowController = async (req, res) => {

        try {
            const { productId } = req.body;
    
            // Fetch the product details by ID
            const product = await Product.findById(productId);
    
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
    
            // Return only the selected product data
            return res.status(200).json({ success: true, product,message: 'Product found' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error' });
        }
    
};

module.exports = buyNowController;
