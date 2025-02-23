const userModel = require("../models/userModel");

async function verifyOtpController(req, res) {
  const { email, otp } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: true, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, error: true, message: "Mobile number already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, error: true, message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, error: true, message: "OTP expired" });
    }

    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true; // Set verified status
    await user.save();

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
}

module.exports = verifyOtpController;
