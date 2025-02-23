const userModel = require('../../models/userModel');
const mongoose = require('mongoose'); 

const verifyOtp = async (req, res) => {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
        return res.status(400).json({ success: false, message: 'Mobile number and OTP are required' });
    }

    try {
        // Find the user by mobile number and check if the OTP is valid
        const user = await userModel.findOne({ mobileNo: mobileNumber });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if the OTP is correct and not expired
        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (Date.now() > user.otpExpires) {
            return res.status(400).json({ success: false, message: 'OTP expired' });
        }

        // OTP verified, generate a token or perform further logic (e.g., login)
        // Here you can generate a JWT token for the user or perform other actions
        const token = 'your-generated-jwt-token'; // Replace with actual JWT generation

        return res.status(200).json({ success: true, message: 'OTP verified', data: token });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ success: false, message: 'Failed to verify OTP' });
    }
};

module.exports = verifyOtp;
