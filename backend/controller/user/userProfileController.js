const express = require('express');
const router = express.Router();
const userModel = require('../../models/userModel');
const orderModel = require('../../models/order'); // Import your order model
const Rating = require('../../models/ratingModel'); // Import the rating model

// Function to handle user profile and ratings
const userProfileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Aggregate total purchasing
        const totalPurchasing = await orderModel.aggregate([
            { $match: { user: req.userId, status: 'paid' } }, // Match orders with 'paid' status
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ]);

        // Get ratings for all items the user has rated
        const ratings = await Rating.find({}); // Modify this if you want to fetch ratings for specific items or user

        res.status(200).json({
            success: true,
            data: {
                user,
                totalPurchasing: totalPurchasing[0] ? totalPurchasing[0].totalAmount : 0,
                ratings, // Include ratings in the response
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || "Server error",
        });
    }
};

// Function to save a rating
const saveRating = async (req, res) => {
    const { itemId, rating } = req.body;

    try {
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5',
            });
        }

        const existingRating = await Rating.findOne({ itemId });

        if (existingRating) {
            // Update existing rating
            existingRating.rating = rating;
            await existingRating.save();
        } else {
            // Create new rating
            const newRating = new Rating({ itemId, rating });
            await newRating.save();
        }

        res.status(200).json({
            success: true,
            message: 'Rating saved successfully!',
        });
    } catch (error) {
        console.error('Error saving rating:', error); // Log the error
        res.status(500).json({
            success: false,
            message: 'Error saving rating. Please try again.',
        });
    }
};

// Function to get a rating by itemId
const getRating = async (req, res) => {
    const { itemId } = req.params;

    try {
        const rating = await Rating.findOne({ itemId });
        if (!rating) {
            return res.status(404).json({
                success: false,
                message: 'Rating not found for this item',
            });
        }

        res.status(200).json({
            success: true,
            rating,
        });
    } catch (error) {
        console.error('Error retrieving rating:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving rating. Please try again.',
        });
    }
};

module.exports = {
    userProfileController,
    saveRating,
    getRating,
};
