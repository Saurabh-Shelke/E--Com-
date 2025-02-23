const Razorpay = require('razorpay');
const Order = require('../../models/order');
const userModel = require("../../models/userModel");
const productModel = require('../../models/productModel');
const Seller  = require("../../models/sellerModel")
require('dotenv').config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY, 
    key_secret: process.env.RAZORPAY_KEY_SECRET_KEY,
});

const Razorpay_key = process.env.RAZORPAY_KEY
const Razorpay_key_secret_key = process.env.RAZORPAY_KEY_SECRET_KEY
const PDFDocument = require('pdfkit');
const nodemailer = require("nodemailer");

const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_BUCKET_REGION,
  });
  
  const s3 = new AWS.S3();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "arjunhanwate.sit.comp@gmail.com",
      pass: process.env.EMAIL_PASSWORD, // Use environment variable for password
    },
  });
  
  const sendInvoiceEmail = async (userEmail, order) => {
    try {
      // Construct the PDF URL using the stored S3 URL
      const pdfUrl = `https://${process.env.REACT_APP_BUCKET_NAME}.s3.amazonaws.com/invoices/${order.order_id}.pdf`;
  
      // Email options
      const mailOptions = {
        from: "arjunhanwate.sit.comp@gmail.com",
        to: "arjunahanwate358@gmail.com",
        subject: `Invoice for Your Order #${order.order_id}`,
        text: `Dear ${order.userId.name},\n\nThank you for your purchase! You can access your invoice using the link below:\n\nInvoice Link: ${pdfUrl}\n\nOrder Details:\n- Order ID: ${order.order_id}\n- Amount Paid: ₹${order.amount}\n\nBest regards,\nYML Mart Team`,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
      console.log(`Invoice email sent to ${userEmail}`);
    } catch (error) {
      console.error("Error sending invoice email:", error);
      throw new Error("Failed to send email");
    }
  };
const createOrder = async (req, res) => {
    const { amount, currency, receipt, userId, products, deliveryAddress } = req.body;
    try {
        const options = {
            amount: amount * 100, // Amount in paisa (multiply by 100)
            currency: currency || "INR",
            receipt: receipt || `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);


        // Save a preliminary order to the database with status 'created'
        const newOrder = new Order({
            order_id: order.id,
            products: products.map(product => ({
                productId: product.productId._id,
                name: product.productId.productName,
                quantity: product.quantity,
                price: product.productId.sellingPrice,
                image: product.productId.productImage,
            })),
            amount: order.amount / 100,
            currency: order.currency,
            receipt: order.receipt,
            userId: userId,
            deliveryAddress: deliveryAddress,

        });
        
        await newOrder.save();
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error creating Razorpay order", error);
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

const handlePaymentSuccess = async (req, res) => { 
    const { order_id, payment_id, signature, userId } = req.body;

    try {
        // Find the existing order by order_id
        const order = await Order.findOne({ order_id })
            .populate('userId')
            .populate('products.productId'); // Make sure productId is populated with product details

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Update the order with payment details
        order.payment_id = payment_id;
        order.signature = signature;
        order.status = 'paid';

        // Update product quantities and seller revenues
        for (const item of order.products) {
            // Update buyer's total purchase amount
            await userModel.findByIdAndUpdate(order.userId._id, { 
                $inc: { "businessPrices.myPurchase": order.amount } 
            });

            const product = await productModel.findById(item.productId);
            if (product) {
                if (product.quantity >= item.quantity) {
                    product.quantity -= item.quantity; // Reduce product quantity
                    // product.purchaseCount = (product.purchaseCount || 0) + item.quantity; // Update purchase count
                    await product.save();

                    // Calculate revenue for the seller of this product
                    const sellerRevenue = (product.sellingPrice * 0.8).toFixed(2); // 80% of product amount, limited to 2 decimal places

                    // Update the seller's revenue
                    await Seller.findByIdAndUpdate(product.sellerId, {
                        $inc: { totalRevenue: sellerRevenue }
                    });
                } else {
                    return res.status(400).json({
                        success: false,
                        message: `Not enough stock for product: ${product.productName}`,
                    });
                }
            }
        }

        // Save the updated order
        const invoiceUrl = await generateInvoiceAndUploadToS3(order);
        order.invoicePath = invoiceUrl; // Store the S3 invoice URL in the order
        await order.save();
        await sendInvoiceEmail(order.userId.email, order);


        // Handle referral system (if applicable)
        const user = await userModel.findById(userId);
        if (user && user.refferal.refferredbycode) {
            const referrer = await userModel.findOne({ 'refferal.refferalcode': user.refferal.refferredbycode });
            if (referrer) {
                // Increment totalPurchase and calculate 5% incentive
                const totalIncentive = 0.05 * order.amount;

                referrer.businessPrices.totalPurchase += order.amount; // Update totalPurchase
                referrer.businessPrices.totalIncentive += totalIncentive; // Update totalIncentive
                referrer.refferal.myrefferalorders.push({
                    userId: user._id,
                    order_id: order._id,
                });

                await referrer.save(); // Save the updated referrer details
            }
        }

        res.status(200).json({ success: true, message: "Payment successful, order and revenue updated",invoiceUrl });
    } catch (error) {
        console.error("Error updating order after payment", error);
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

const generateInvoiceAndUploadToS3 = (order) => {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', async () => {
        const pdfBuffer = Buffer.concat(chunks);
  
        // S3 Upload Parameters
        const params = {
          Bucket: process.env.REACT_APP_BUCKET_NAME,
          Key: `invoices/${order.order_id}.pdf`, // Invoice path in S3
          Body: pdfBuffer,
          ContentType: 'application/pdf',
        };
  
        // Upload to S3
        s3.upload(params, (err, data) => {
          if (err) {
            console.error("Error uploading invoice to S3:", err);
            return reject(err);
          }
          console.log("Invoice uploaded successfully:", data.Location);
          resolve(data.Location); // Return the file URL
        });
      });
  
      // Write invoice content
      doc.fontSize(16).text("Invoice", { align: 'center' });
      doc.fontSize(12).text(`Order ID: ${order.order_id}`);
      doc.text(`User ID: ${order.userId}`);
      doc.text(`Amount Paid: ₹${order.amount}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown().text("Products:");
  
      // Add product details
      order.products.forEach((product, index) => {
        doc.text(
          `${index + 1}. ${product.productId.name} - Quantity: ${product.quantity}, Price: ₹${product.productId.sellingPrice}`
        );
      });
  
      doc.end();
    });
  };

module.exports = { createOrder, handlePaymentSuccess };
