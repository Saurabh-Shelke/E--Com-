const productModel = require("../../models/productModel")

const filterProductController = async (req, res) => {
    try {
        const { category = [], subcategory = [], sortBy } = req.body;

        // Build the query object for categories and subcategories
        const query = {};

        if (category.length > 0) {
            query.category = { "$in": category };
        }

        if (subcategory.length > 0) {
            query.subcategory = { "$in": subcategory };
        }

        // Determine the sorting logic based on `sortBy`
        let sortOption = {};
        if (sortBy === "asc") {
            sortOption.sellingPrice = 1; // Price: Low to High
        } else if (sortBy === "dsc") {
            sortOption.sellingPrice = -1; // Price: High to Low
        } else if (sortBy === "popularity") {
            sortOption.popularity = -1; // Sort by popularity
        }

        // Fetch the products based on the query and sorting
        const products = await productModel.find(query).sort(sortOption);

        res.json({
            data: products,
            message: "Filtered products",
            error: false,
            success: true
        });
    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = filterProductController;
