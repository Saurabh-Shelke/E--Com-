const userModel = require('../../models/userModel');
const orderModel = require('../../models/order');

const getReferralOrders = async (req, res) => {
  try {
    // Step 1: Fetch the user data based on req.userId
    const user = await userModel.findById(req.userId);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 2: Extract the order IDs from the user's referral orders
    const orderIds = user.refferal.myrefferalorders.map(order => order.order_id);

    const userIds = user.refferal.myrefferals.map(refUser => refUser.userId);
    

    // Step 3: Fetch the order details from the order model
    const orders = await orderModel.find({ _id: { $in: orderIds } });
    const users = await userModel.find({_id: {$in: userIds} })

    // Step 4: Send the response with the order details
    res.status(200).json({ user, users, orders });

  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = getReferralOrders;
