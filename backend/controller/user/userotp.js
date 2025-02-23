const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userModel = require('../../models/userModel');
const jwt = require('jsonwebtoken');

const otpStore = {}; // Ensure this is properly managed in production

async function verifyOTPController(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new Error("Email and OTP are required");
    }

    if (otpStore[email] === otp) {
      // OTP matches
      delete otpStore[email]; // Clear OTP after successful verification

      // Generate a JWT token
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      const tokenData = {
        _id: user._id,
        email: user.email,
      };
      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 8 });

      res.status(200).json({
        message: "OTP verified successfully",
        token,
        success: true,
      });
    } else {
      throw new Error("Invalid OTP");
    }
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

module.exports = verifyOTPController;
