const userModel = require("../models/userModel");
const otpGenerator = require("otp-generator");
const axios = require("axios");

const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;

async function sendOtp(mobileNo, otp) {
  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&sender_id=FSTSMS&message=Your OTP code is ${otp}&route=v3&numbers=${mobileNo}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Failed to send OTP');
  }
}

async function sendOtpController(req, res) {
  const { mobileNo } = req.body;

  try {
    const user = await userModel.findOne({ mobileNo });

    if (!user) {
      return res.status(404).json({ success: false, error: true, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, error: true, message: "Mobile number already verified" });
    }

    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    user.otp = otp;
    user.otpExpires = Date.now() + 15 * 60 * 1000; // Set OTP to expire in 15 minutes
    await user.save();

    const otpResult = await sendOtp(mobileNo, otp);

    if (otpResult.return === false) {
      throw new Error("Failed to send OTP. Please try again.");
    }

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
}

module.exports = sendOtpController;
