const bcrypt = require('bcryptjs');
const Seller = require('../../models/sellerModel');

async function sellerSignUp(req, res) {

    const { mobile, email, gstin, password, fullName, displayName } = req.body;
    // Input validation
    if (!mobile || !email || !gstin || !password || !fullName || !displayName) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if seller already exists
        const existingSeller = await Seller.findOne({ $or: [{ mobile }, { email }, { gstin }] });
        if (existingSeller) {
            return res.status(400).json({ message: 'Seller already exists with this mobile, email, or GSTIN.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new seller instance
        const seller = new Seller({
            mobile,
            email,
            gstin,
            password: hashedPassword,
            fullName,
            displayName,
        });

        // Save the seller to the database
        await seller.save();
        
        res.status(201).json({
            data: seller,
            success: true,
            error: false,
            message:"User created successfully"
          });    } catch (error) {
        console.error('Error registering seller:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

module.exports = sellerSignUp;
