const KYC = require('../../models/kyc');
const mongoose = require('mongoose'); // Import mongoose to handle ObjectId

const updateKycController = async (req, res) => {
    const { kycId } = req.body;
    const { kycStatus } = req.body;

    // Log the incoming kycId and request body for debugging
    // console.log('kycId:', kycId);
    // console.log('Status:', kycStatus);

    // Validate kycId format
    if (!mongoose.Types.ObjectId.isValid(kycId)) {
        return res.status(400).json({ message: 'Invalid KYC ID format' });
    }

    try {
        // Find the KYC by ID and update the Status
        const kyc = await KYC.findByIdAndUpdate(kycId, { kycStatus }, { new: true });

        if (!kyc) {
            return res.status(404).json({ message: 'KYC not found' });
        }

        res.status(200).json({ message: 'KYC status updated successfully', kyc });
    } catch (error) {
        console.error('Error updating KYC status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = updateKycController;
