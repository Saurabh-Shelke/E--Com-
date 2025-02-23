const AdBannerModel = require("../../models/adBannerModel");

const getAdBannerController = async (req, res) => {
    try {
        // Fetch all banners from the database
        const allAdBanners = await AdBannerModel.find().sort({ createdAt: -1 });

        // Transform array into an object
        const AdBannerObject = allAdBanners.reduce((acc, adbanner) => {
            acc[adbanner._id] = adbanner; // Use banner._id as the key
            return acc;
        }, {});
        // console.log(AdBannerObject)

        res.json({
            message: "All Banner",
            success: true,
            error: false,
            data: AdBannerObject
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = getAdBannerController;
