// Backend/controllers/bannerController.js

const AdBanner = require('../../models/adBannerModel');
const uploadProductPermission = require('../../helpers/permission'); // Adjust the path as necessary

const uploadAdBanner = async (req, res) => {
    const { userId, imageUrl } = req.body;

    try {
        const hasPermission = await uploadProductPermission(userId);

        if (!hasPermission) {
            return res.status(403).json({ message: 'You do not have permission to upload a banner or user not found.' });
        }

        const newAdBanner = await AdBanner.create({ imageUrl });
        res.status(201).json(newAdBanner);
    } catch (error) {
        console.error('Error in uploadBanner:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = uploadAdBanner;
