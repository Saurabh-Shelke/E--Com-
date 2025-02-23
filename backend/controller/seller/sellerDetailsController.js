const sellerModel = require("../../models/sellerModel")


async function sellerDetailsController(req,res){
    try{
        const userId = req.userId;
        const user = await sellerModel.findById(userId)
    
        res.status(200).json({
            data : user,
            error : false,
            success : true,
            message : "seller details"
        })

   

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = sellerDetailsController