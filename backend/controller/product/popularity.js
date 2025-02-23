const productModel = require("../../models/productModel");

const popularity = async (req, res) => {
    try {
        const { category, sortBy } = req.body;

        // Build query based on the category
        let query = {};
        if (category && category.length > 0) {
            query.category = { $in: category };
        }

        // Fetch products based on the query
        let products = await productModel.find(query);

        // Apply additional filtering for popularity if requested
        if (sortBy === 'popularity') {
            products = products.filter(product => product.purchaseCount > 10);
        }

        // Send response with filtered products
        res.json({
            data: products,
            message: "Products filtered successfully",
            success: true,
            error: false
        });

    } catch (err) {
        // Handle any errors that occur
        res.json({
            message: err?.message || "An error occurred while filtering products",
            error: true,
            success: false
        });
    }
};

module.exports = popularity;
