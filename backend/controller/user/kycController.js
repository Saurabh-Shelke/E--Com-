const KYC = require('../../models/kyc'); // Import the KYC model

// Controller function for handling KYC data and file uploads (POST method)
const postKYC = async (req, res) => {
  try {
    const userId = req.body.userId;

    // Check if KYC details for the user already exist
    const existingKYC = await KYC.findOne({ userId });

    if (existingKYC) {
      return res.status(400).json({
        success: false,
        message: 'KYC details already exist for this user.',
      });
    }

    // Create a new KYC document
    const kycDetails = new KYC({
      userId,
      panNumber: req.body.panNumber || '', // Defaults to empty string if not provided
      panName: req.body.panName || '',
      panCardFilePath: req.body.panCardFile || null, // Now receiving URLs from frontend
      aadharNumber: req.body.aadharNumber || '',
      aadharName: req.body.aadharName || '',
      aadharFilePath: req.body.aadharFile || null, // URL
      accountHolderName: req.body.accountHolderName || '',
      accountNumber: req.body.accountNumber || '',
      ifscCode: req.body.ifscCode || '',
      passbookFilePath: req.body.passbookFile || null, // URL
    });

    // Save the KYC document to the database
    await kycDetails.save();

    res.status(201).json({
      success: true,
      message: 'KYC details and files uploaded successfully!',
      data: kycDetails,
    });
  } catch (error) {
    console.error('Error processing KYC details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload KYC details and files.',
      error: error.message,
    });
  }
};

module.exports = {
  postKYC,
};
