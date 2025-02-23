// Backend/controllers/bannerController.js

const Banner = require('../../models/bannerModel');
const uploadProductPermission = require('../../helpers/permission'); // Adjust the path as necessary

const uploadBanner = async (req, res) => {
    const { userId, imageUrl } = req.body;

    try {
        const hasPermission = await uploadProductPermission(userId);
        console.log(hasPermission)

        if (!hasPermission) {
            return res.status(403).json({ message: 'You do not have permission to upload a banner or user not found.' });
        }

        const newBanner = await Banner.create({ imageUrl });
        res.status(201).json(newBanner);
    } catch (error) {
        console.error('Error in uploadBanner:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = uploadBanner;
