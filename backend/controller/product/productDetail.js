const ProductModel = require("../../models/productModel")

const productDetail = async(req,res)=>{
    try {
        // Extract productId from the request parameters
        const productId = req.params.productId;  // Extract productId from URL
        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            product  // Return the product details
        });
    } catch (error) {
        console.error("Error fetching product details:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

module.exports = productDetail