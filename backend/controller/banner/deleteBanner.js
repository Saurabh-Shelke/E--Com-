const bannerModel = require("../../models/bannerModel");

const deleteBannerController = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the banner by ID
    const deletedBanner = await bannerModel.findByIdAndDelete(id);

    if (!deletedBanner) {
      return res.status(404).json({
        message: "Banner not found",
        success: false,
        error: true,
      });
    }

    res.json({
      message: "Banner deleted successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Error deleting banner",
      error: true,
      success: false,
    });
  }
};

module.exports = deleteBannerController;
