const userModel = require("../models/userModel");

const uploadProductPermission = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        
        if (!user) {
            // console.log(`User not found with ID: ${userId}`);
            return false; // User not found, return false
        }

        if (user.role === 'ADMIN' || 'SUPER_ADMIN') {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error in uploadProductPermission:', error);
        throw error;
    }
};

module.exports = uploadProductPermission;
