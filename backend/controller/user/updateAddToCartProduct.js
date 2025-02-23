const addToCartModel = require("../../models/cartProduct")
const productModel = require("../../models/productModel")

const updateAddToCartProduct = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const addToCartProductId = req.body._id;
    const productId = req.body.productId;
    const requestedQty = req.body.quantity;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    // Check if the requested quantity exceeds available stock
    if (requestedQty > product.quantity) {
      return res.json({
        message: `Only ${product.quantity} item(s) left in stock`,
        availableStock: product.quantity,
        outOfStock: true, // Flag to indicate the product is out of stock for the user's cart
        error: true,
        success: false,
      });
    }

    // Update the cart with the new quantity
    const updateProduct = await addToCartModel.updateOne(
      { _id: addToCartProductId },
      { quantity: requestedQty }
    );

    res.json({
      message: "Product Updated",
      data: updateProduct,
      availableStock: product.quantity, // Send available stock data to frontend
      outOfStock: product.quantity === 0, // Send out-of-stock flag
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};


module.exports = updateAddToCartProduct