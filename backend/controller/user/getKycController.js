const mongoose = require('mongoose');
const KYC = require('../../models/kyc'); // Import the KYC model
const User = require('../../models/userModel'); // Import the User model

// Controller function for retrieving users who have submitted KYC (GET method)
const getKYCController = async (req, res) => {
  try {
    // Find all KYC details
    const kycDetails = await KYC.find({});

    // Extract userIds from KYC details
    const userIds = kycDetails.map(kyc => kyc.userId);

    // Fetch user details
    const usersWithKYC = await User.find({ _id: { $in: userIds } });

    // Create a mapping of userId to userName for easy lookup
    const userMap = usersWithKYC.reduce((map, user) => {
      map[user._id] = user.name; // Adjust based on your user schema
      return map;
    }, {});

    // Attach userName to each KYC detail
    const kycWithUserNames = kycDetails.map(kyc => ({
      ...kyc.toObject(),
      customerName: userMap[kyc.userId] || 'No name available'
    }));

    if (kycWithUserNames.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users with submitted KYC found.',
      });
    }

    res.status(200).json({
      success: true,
      data: kycWithUserNames,
    });
  } catch (error) {
    console.error('Error retrieving users with submitted KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving users with submitted KYC.',
    });
  }
};

module.exports = {
  getKYCController,
};
