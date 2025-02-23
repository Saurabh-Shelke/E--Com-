const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');

async function forgetpassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    // Check if email and new password are provided
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    // Find the user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Respond with success message
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in forgetpassword:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = forgetpassword;
