const bannerModel = require("../../models/bannerModel");

const getProductController = async (req, res) => {
    try {
        // Fetch all banners from the database
        const allBanners = await bannerModel.find().sort({ createdAt: -1 });

        // Transform array into an object
        const bannerObject = allBanners.reduce((acc, banner) => {
            acc[banner._id] = banner; // Use banner._id as the key
            return acc;
        }, {});
        // console.log(bannerObject)

        res.json({
            message: "All Banner",
            success: true,
            error: false,
            data: bannerObject
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = getProductController;
