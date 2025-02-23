// const backendDomin = process.env.REACT_APP_API_URL
const backendDomin = process.env.REACT_APP_LOCALHOST_URI;

const SummaryApi = {
    signUP: {
        url: `${backendDomin}/api/signup`,
        method: "post"
    },
    sellerSignUP: {
        url: `${backendDomin}/api/signupseller`,
        method: "post"
    },
    sellerSignIn: {
        url: `${backendDomin}/api/signinseller`,
        method: "post"
    },
    sellerDetails: {
        url: `${backendDomin}/api/sellerdetails`,
        method: "get"
    },
    sellerLogout: {
        url: `${backendDomin}/api/sellerLogout`,
    },
    sendOtp: {
        url: `${backendDomin}/api/send-otp`,
        method: "post"
    },
    verifyOtp: {
        url: `${backendDomin}/api/verify-otp`,
        method: "post"
    },
    signIn: {
        url: `${backendDomin}/api/signin`,
        method: "post"
    },
    current_user: {
        url: `${backendDomin}/api/user-details`,
        method: "get"
    },
    forgetpassword:{
        url: `${backendDomin}/api/forgetpassword`,
        method: "post"
    },
    // current_seller: {
    //     url: `${backendDomin}/api/seller-details`,
    //     method: "get"
    // },
    clear_cart: {
        url: `${backendDomin}/api/clear_cart`,
        method: "post"
    },
    logout_user: {
        url: `${backendDomin}/api/userLogout`,
        method: 'get'
    },
    allUser: {
        url: `${backendDomin}/api/all-user`,
        method: 'get'
    },
    referralOrders: {
        url: `${backendDomin}/api/referralOrders`,
        method: 'get'
    },
    updateUser: {
        url: `${backendDomin}/api/update-user`,
        method: "post"
    },
    uploadProduct: {
        url: `${backendDomin}/api/upload-product`,
        method: 'post'
    },
    uploadAddress: {
        url: `${backendDomin}/api/user-details`,
        method: 'post'
    },
    uploadBanner: {
        url: `${backendDomin}/api/upload-banner`,
        method: 'post'
    },
    uploadAdBanner: {  // Upload a new ad banner
        url: `${backendDomin}/api/upload-adbanner`,
        method: 'post'
    },
    getOrders: {
        url: `${backendDomin}/api/dashboard`,
        method: 'get'
    },
    allProduct: {
        url: `${backendDomin}/api/get-product`,
        method: 'get'
    },
    allSellerProduct: {
        url: `${backendDomin}/api/getsellerproduct`,
        method: 'get'
    },
    allBanner: {
        url: `${backendDomin}/api/all-banner`,
        method: 'get'
    },
    deleteBanner: {
        url: `${backendDomin}/api/all-banner`,
        method: 'delete'
    },
    replaceBanner: {
        url: `${backendDomin}/api/all-banner`,
        method: 'put'
    },
    allAdBanner: {  // Fetch all ad banners
        url: `${backendDomin}/api/all-adbanner`,
        method: 'get'
    },
    deleteAdBanner: {  // Delete an ad banner
        url: `${backendDomin}/api/all-adbanner`,
        method: 'delete'
    },
    updateProduct: {
        url: `${backendDomin}/api/update-product`,
        method: 'post'
    },
    deleteProduct: {
        url: `${backendDomin}/api/delete-product`,
        method: 'delete'
    },
    deleteAddress: {
        url: `${backendDomin}/api/delete-address`,
        method: 'delete'
    },
    categoryProduct: {
        url: `${backendDomin}/api/get-categoryProduct`,
        method: 'get'
    },
    categoryWiseProduct: {
        url: `${backendDomin}/api/category-product`,
        method: 'post'
    },
    productDetails: {
        url: `${backendDomin}/api/product-details`,
        method: 'post'
    },
    addToCartProduct: {
        url: `${backendDomin}/api/addtocart`,
        method: 'post'
    },
    mergeCart: {
        url: `${backendDomin}/api/mergeCart`,
        method: 'post'
    },
    productDetail: {
        url: `${backendDomin}/api/getProductDetail`,
        method: 'get'
    },
    buyNow: {
        url: `${backendDomin}/api/buyNow`,
        method: "post"
    },
    addToCartProductCount: {
        url: `${backendDomin}/api/countAddToCartProduct`,
        method: 'get'
    },
    addToCartProductView: {
        url: `${backendDomin}/api/view-card-product`,
        method: 'get'
    },
    updateCartProduct: {
        url: `${backendDomin}/api/update-cart-product`,
        method: 'post'
    },
    deleteCartProduct: {
        url: `${backendDomin}/api/delete-cart-product`,
        method: 'post'
    },
    searchProduct: {
        url: `${backendDomin}/api/search`,
        method: 'get'
    },
    filterProduct: {
        url: `${backendDomin}/api/filter-product`,
        method: 'post'
    },
    uploadKYC: {
        url: `${backendDomin}/api/upload-kyc`,
        method: 'post'
    },
    getKYC: {
        url: `${backendDomin}/api/users-with-kyc`,
        method: 'get'
    },
    saveRating: {
        url: `${backendDomin}/api/rating/saveRating`, 
        method: 'post'
    },
    getRating: {
        url: `${backendDomin}/api/rating/:itemId`,
        method: 'get'
    },
    createOrder: {
        url: `${backendDomin}/api/payment/create-order`,
        method: 'post'
    },
    payment_Success: {
        url: `${backendDomin}/api/payment/payment-success`,
        method: 'post'
    },
    pushAllPricesInDb: {
        url: `${backendDomin}/api/businessPrices`,
        method: 'post'
    },
    getmykyc: {
        url: `${backendDomin}/api/user-kyc/:userId`,
        method: 'get'
    },
    reset: {
        url: `${backendDomin}/api/reset`,
        method: "post"
    },
};

export default SummaryApi;
