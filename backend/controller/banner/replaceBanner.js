const bannerModel = require("../../models/bannerModel");

const replaceBannerController = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body; // New image URL

    // Check if the new image URL is provided
    if (!imageUrl) {
      return res.status(400).json({
        message: "Image URL is required",
        success: false,
        error: true,
      });
    }

    // Find and update the banner's image URL
    const updatedBanner = await bannerModel.findByIdAndUpdate(
      id,
      { imageUrl }, // Update the image URL
      { new: true } // Return the updated document
    );

    if (!updatedBanner) {
      return res.status(404).json({
        message: "Banner not found",
        success: false,
        error: true,
      });
    }

    res.json({
      message: "Banner replaced successfully",
      success: true,
      error: false,
      data: updatedBanner, // Return the updated banner
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Error replacing banner",
      error: true,
      success: false,
    });
  }
};

module.exports = replaceBannerController;
