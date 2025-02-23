const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productName: String,
    brandName: String,
    category: String,
    subcategory: String,  // New subcategory field
    productImage: [],
    description: String,
    price: Number,
    sellingPrice: Number,
    quantity: Number,
    soldBy:String,
    features :String,
    productInfo :String,
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: false }, // Optional field

    
}, {
    timestamps: true
});

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
