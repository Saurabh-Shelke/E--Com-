const productModel = require("../../models/productModel")

const getSellerProduct = async(req,res)=>{
    try{
        const { sellerId } = req.query;
        const allProducts = await productModel.find({ sellerId }).sort({ createdAt: -1 });

        res.json({
            message : "All Product",
            success : true,
            error : false,
            data : allProducts
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }

}

module.exports = getSellerProduct