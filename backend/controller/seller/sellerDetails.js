const Seller = require("../../models/sellerModel")


async function sellerDetails(req,res){
    try{
        const userId = req.userId;
        console.log(userId)
        const user = await Seller.findById(userId)
        .sort({ createdAt: -1 }) // Sorting in descending order (newest first)
        .exec();
        
        // console.log('User Data:', user); // Log user data
        // console.log('Order Data:', order)
    
        res.status(200).json({
            data : user,
            error : false,
            success : true,
            message : "User details"
        })

   

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = sellerDetails