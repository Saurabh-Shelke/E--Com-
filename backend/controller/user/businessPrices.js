const User = require('../../models/userModel'); // Import the User model

// Controller to handle saving prices in the database
const businessPrices = async (req, res) => {
    const { totalBusiness, totalIntensive, totalPurchasing, userId } = req.body;

    console.log('Received values:', { totalBusiness, totalIntensive, totalPurchasing, userId });
  
    if (!userId || totalBusiness === undefined || totalIntensive === undefined || totalPurchasing === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    // console.log(`${userId} is updating their business prices`);
  
    try {
      // Update the user's businessPrices object
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            "businessPrices.myPurchase": totalPurchasing,
            "businessPrices.totalPurchase": totalBusiness,
            "businessPrices.totalIncentive": totalIntensive
          }
        },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Success response
      res.status(200).json({ message: 'Prices updated successfully', user });
    } catch (error) {
      console.error('Error updating user prices:', error);
      res.status(500).json({ message: 'Server error' });
    }
};

module.exports = businessPrices;
