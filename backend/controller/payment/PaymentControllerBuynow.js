// const Razorpay = require('razorpay');
// const Order = require('../../models/order'); // Import the Order model
// const userModel = require("../../models/userModel")

// const razorpay = new Razorpay({
//     key_id: 'rzp_test_U4XuiM2cjeWzma',
//     key_secret: '2CXOAspw2Cgr0wlTz6vc0e8J',
// });




// // const handlePaymentSuccessBuynow = async (req, res) => {
// //     const { order_id, payment_id, signature,userId } = req.body;

// //     try {
// //         // Find the existing order by order_id
// //         const order = await Order.findOne({ order_id });

// //         if (!order) {
// //             return res.status(404).json({ success: false, message: "Order not found" });
// //         }

// //         // Update the order with payment details
// //         order.payment_id = payment_id;
// //         order.signature = signature;
// //         order.status = 'paid';


       
       


// //         await order.save();

// //         const user = await userModel.findById(userId);
// //         console.log(user);

// //         if (user && user.refferal.refferredbycode) {
// //             // Find the referrer using the referred by code
// //             const referrer = await userModel.findOne({ 'refferal.refferalcode': user.refferal.refferredbycode });
// //             console.log(referrer);
// //             if (referrer) {
// //                 // Add the order details to the referrer's myrefferals array
// //                 // referrer.refferal.myrefferals.push({});
// //                 referrer.refferal.myrefferalorders.push({
// //                     'userId':user._id,
// //                     // 'name':user.name,
// //                     "order_id": order._id
                    

// //                 });

// //                 // Save the referrer with the updated myrefferals array
// //                 await referrer.save();
// //             }
// //         }

        

// //         res.status(200).json({ success: true, message: "Payment successful, order updated" });
// //     } catch (error) {
// //         console.error("Error updating order after payment", error);
// //         res.status(500).json({ success: false, message: "Server Error", error });
// //     }
// // };

// module.exports = { createOrderBuynow, handlePaymentSuccessBuynow };