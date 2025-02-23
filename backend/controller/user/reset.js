const userModel = require("../../models/userModel")


const reset = async (req, res) => {
  try {
    await userModel.updateMany({}, { 'businessPrices.totalPurchase': 0 });

   res.json({
    message: "Total purchases reset successfully for all users.",
    success: true,
    error: false,
  });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};


module.exports = reset