// models/ratingModel.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true,
        unique: true, // Ensures that each itemId has a unique rating
    },
    rating: {
        type: Number,
        required: true,
        min: 1, // Minimum rating
        max: 5, // Maximum rating
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
