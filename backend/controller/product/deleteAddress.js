// const deleteProductPermission = require('../../helpers/permission');
const userModel = require('../../models/userModel');

async function deleteAddress(req, res) {
    try {

        // console.log('Request Body:', req.body);

        // Extract product ID from the request body
        const { AddressId, userId } = req.body;

        // Check if the product ID is provided
        if (!AddressId || !userId) {
            return res.status(400).json({
                message: 'Address ID is required',
                success: false,
                error: true,
            });
        }

        // Find and delete the product by ID
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                $pull: { address: { _id: AddressId } }, // Remove the address with the given addressId
            },
            { new: true } // Return the updated document
        );

        // Check if the product was found and deleted


        // Respond with success message
        res.json({
            message: 'Address deleted successfully',
            data: updatedUser,
            success: true,
            error: false,
            messageType: 'success',
        });

    } catch (err) {
        // Log the error and respond with an error message
        console.error('Error:', err.message || err);
        res.status(500).json({
            message: err.message || 'An error occurred',
            success: false,
            error: true,
        });
    }
}

module.exports = deleteAddress;
