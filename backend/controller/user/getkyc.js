const KYC = require('../../models/kyc'); // Import the KYC model

// Controller function for retrieving KYC status by userId (GET method)
const getkyc = async (req, res) => {
  try {
    // Extract userId from request parameters
    const { userId } = req.params;

    // Check if KYC details for the user exist
    const kycDetails = await KYC.findOne({ userId });
    
    // If KYC details are not found, send a 404 response
    if (!kycDetails) {
      return res.status(404).json({
        success: false,
        message: 'No KYC details found for this user.',
      });
    }

    // If KYC details exist, return them
    return res.status(200).json({
      success: true,
      message: 'KYC details found.',
      data: kycDetails,
    });
  } catch (error) {
    console.error('Error retrieving KYC details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve KYC details.',
      error: error.message,
    });
  }
};

module.exports = {
  getkyc,
};