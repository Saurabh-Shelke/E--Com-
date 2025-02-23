const userModel = require('../../models/userModel');
const mongoose = require('mongoose'); 
const crypto = require('crypto'); // For generating OTP
const twilio = require('twilio'); // Example SMS service, can be any other service

// Twilio configuration (or any other service credentials)
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio Auth Token
const client = twilio(accountSid, authToken);

const sendOtp = async (req, res) => {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
        return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    try {
        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Store the OTP and expiry time in the database for the user
        const user = await userModel.findOneAndUpdate(
            { mobileNo: mobileNumber }, // Changed mobileNumber to mobileNo to match schema
            {
                otp,
                otpExpires: Date.now() + 5 * 60 * 1000 // OTP expires in 5 minutes
            },
            { new: true, upsert: true } // Create new record if not found
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Send OTP via SMS using Twilio or any other SMS service
        await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
            to: mobileNumber
        });

        return res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
};

module.exports = sendOtp;
