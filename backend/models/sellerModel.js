const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    mobile: {
        type: Number,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gstin: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    totalRevenue: {
        type: Number,
        default: 0 // Initialize it to zero if it’s not already present
    },
}, { timestamps: true });

// Create the model
const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
