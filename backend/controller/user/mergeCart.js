const addToCartModel = require("../../models/cartProduct");

const mergeCart = async (req, res) => {
  try {
    const { cart: guestCart } = req.body; // Guest cart from request body
    const currentUser = req.userId;

    if (!Array.isArray(guestCart) || guestCart.length === 0) {
      return res.json({
        message: "No items in the guest cart to merge",
        success: false,
        error: true,
      });
    }

    const addedProducts = [];
    const skippedProducts = [];

    for (const item of guestCart) {
      const { productId, quantity = 1 } = item; // Default quantity to 1 if missing

      // Check if the product already exists for the user
      const isProductAvailable = await addToCartModel.findOne({
        productId,
        userId: currentUser,
      });

      if (isProductAvailable) {
        skippedProducts.push(productId); // Skip this product
      } else {
        const payload = {
          productId,
          quantity,
          userId: currentUser,
        };

        const newCartItem = new addToCartModel(payload);
        const savedItem = await newCartItem.save();
        addedProducts.push(savedItem);
      }
    }

    return res.json({
      data: {
        addedProducts,
        skippedProducts,
      },
      message: "Guest cart merged successfully",
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("Error merging cart:", error);
    res.status(500).json({
      message: error.message || "An error occurred while merging the cart",
      error: true,
      success: false,
    });
  }
};

module.exports = mergeCart;
