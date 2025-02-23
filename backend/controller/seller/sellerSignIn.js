const bcrypt = require('bcryptjs');
const Seller = require('../../models/sellerModel');
const jwt = require('jsonwebtoken');


async function sellerSignIn(req, res) {
    const { email, password } = req.body;
    console.log(req.body)
    try {
        // Find the seller by email
        const seller = await Seller.findOne({ email });
        
        // If seller does not exist
        if (!seller) {
            return res.status(400).json({ success: false, message: "Invalid email or password." });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, seller.password); // assuming password is hashed

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password." });
        }

        const sellerr = await Seller.findOne({email})

            const tokenData = {
                _id : sellerr._id,
                email : sellerr.email,
                 type: "seller"
            }
        


        // Optionally create a token
        const sellerToken = await jwt.sign(tokenData, process.env.SELLER_TOKEN_SECRET_KEY, { expiresIn: '8h' });

        // Respond with success
        res.status(200).json({ success: true, message: "Login successful!", sellerToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
   
}

module.exports = sellerSignIn;
