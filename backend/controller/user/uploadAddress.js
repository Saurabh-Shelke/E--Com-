const User = require('../../models/userModel'); // Adjust the path as needed

async function uploadAddressController(req, res) {
    try {
        const userId = req.userId || req.user.id; // Assuming userId comes from req.userId or req.user.id if using middleware
        const { address } = req.body; // Expecting address object from request body

        // Validate required fields
        if (!address || !address.name || !address.mobileNo || !address.street || !address.city || !address.state || !address.zip) {
            return res.status(400).json({
                message: 'Incomplete address data provided. Please provide all fields.',
                error: true,
                success: false
            });
        }

        // Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            });
        }

        // Add new address to the beginning of the address list
        user.address.unshift(address);

        // Save the updated user document
        const updatedUser = await user.save();

        // Respond with the updated address list or user data
        res.json({
            message: 'Address added successfully!',
            data: updatedUser.address, // Only returning the address list to avoid sending sensitive user data
            success: true,
            error: false
        });

    } catch (err) {
        console.error('Error updating address:', err);
        res.status(500).json({
            message: 'Server error: ' + err.message,
            error: true,
            success: false
        });
    }
}

module.exports = uploadAddressController;
