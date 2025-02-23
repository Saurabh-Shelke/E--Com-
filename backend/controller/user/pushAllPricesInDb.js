const User = require('../../models/userModel'); // Import the User model

// Controller to handle saving prices in the database
const pushAllPricesInDb = async (req, res) => {
  const { totalBusiness, totalIntensive, totalPurchasing,userId } = req.body;
  try {
    // Update the user's totalBusiness, totalIntensive, and totalPurchasing
    const user = await User.findByIdAndUpdate(userId, {
        totalPurchasing: totalBusiness,
        totalIncentive: totalIntensive,
        myPurchasing: totalPurchasing
      }, { new: true });
      

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Prices updated successfully', user });
  } catch (error) {
    console.error('Error updating user prices:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { pushAllPricesInDb };
