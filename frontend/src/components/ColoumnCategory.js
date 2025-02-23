import React, { useContext, useEffect, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import { Link, useNavigate } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context/index';
import SummaryApi from '../common';


const Column = ({ category, heading }) => {
    const { authToken } = useContext(Context);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadingList = new Array(12).fill(null); // Show up to 12 loading placeholders
    const { fetchUserAddToCart } = useContext(Context);
    const navigate = useNavigate();

    // Handle Add to Cart

    const handleAddToCart = async (e, id) => {
        // Retrieve authToken (e.g., from localStorage or cookies)
        const authToken = localStorage.getItem("authToken") || null;
    
        // Check if the token is valid
        const isLoggedIn = authToken && isValidToken(authToken);
    
        if (isLoggedIn) {
            e.stopPropagation();
            await addToCart(e, id, authToken); // This adds the product to the cart (logged-in user)
            fetchUserAddToCart && fetchUserAddToCart();

        } else {
            // Guest user flow: Fetch product details
            const localCart = JSON.parse(localStorage.getItem("guestCart")) || [];
            const productDetails = await fetchProductDetails(id); // Fetch product details from the server or a local file
    
            const isProductInCart = localCart.some(item => item.productId === id);
    
            if (isProductInCart) {
                alert("Product already exists in cart");
            } else {
                localCart.push({
                    productId: id,
                    quantity: 1,
                    productDetails: productDetails // Store full product details in localStorage
                });
                localStorage.setItem("guestCart", JSON.stringify(localCart));
                alert("Product added to cart");
            }
        }
    };

    const fetchProductDetails = async (productId) => {
        try {
            const response = await fetch(`${SummaryApi.productDetail.url}/${productId}`, {
                method: SummaryApi.productDetail.method,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await response.json();
            if (data.success) {
                return data.product; // Return the full product data
            } else {
                console.error("Failed to fetch product details");
                return {};
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
            return {};
        }
    };
    
        
        
        // Utility function to check token validity
        const isValidToken = (token) => {
            try {
                const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
                return payload.exp * 1000 > Date.now(); // Check expiration
            } catch {
                return false; // Invalid token
            }
        };

    // Fetch data and limit it to 12 products
    const fetchData = async () => {
        setLoading(true);
        try {
            const categoryProduct = await fetchCategoryWiseProduct(category);
            setData(Array.isArray(categoryProduct?.data) ? categoryProduct.data.slice(0, 12) : []);
        } catch (error) {
            console.error('Failed to fetch category-wise products:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [category]);

    // Calculate percentage off
    const calculateDiscountPercentage = (price, sellingPrice) => {
        if (price > 0) {
            return Math.round(((price - sellingPrice) / price) * 100);
        }
        return 0;
    };

    // Navigate to the full grocery view
    const handleViewAll = () => navigate(`/product-category?category=${category}`);

    return (
        <div className='container mx-auto px-4 sm:px-6 md:px-8 my-6'>
            <div className="flex justify-between items-center mb-4">
                <h2 className='text-xl sm:text-2xl font-semibold'>{heading}</h2>
                <button
                    className="font-bold py-2 px-3 rounded-md transition-transform duration-300 hover:scale-105 text-sky-800"
                    onClick={handleViewAll}
                >
                    View All
                </button>
            </div>

            {/* Two-row layout with responsive grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {loading ? (
                    loadingList.map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg" style={{ minWidth: '150px' }}>
                            <div className="bg-slate-200 h-36 flex justify-center items-center animate-pulse"></div>
                            <div className="p-2 space-y-2">
                                <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                                <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                                <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    data.map((product, index) => (
                        <Link
                            key={index}
                            to={`/product/${product?._id}`}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                            style={{ minWidth: '150px' }} // Keep it responsive
                        >
                            <div className="h-32 px-2 pt-2 flex justify-center items-center">
                                <img
                                    src={product.productImage[0]}
                                    className="object-contain h-full w-full transition-transform duration-300 hover:scale-105"
                                    alt={product?.productName}
                                />
                            </div>
                            <div className="px-4 py-3 space-y-1">
                                <h3 className="text-sm font-semibold text-gray-800 truncate">{product?.productName}</h3>
                                <div className="flex items-center justify-between pb-1">
                                    <p className="text-gray-800 text-base font-semibold">
                                        {displayINRCurrency(product?.sellingPrice)}
                                    </p>
                                    <p className="text-slate-400 text-xs line-through">
                                        {displayINRCurrency(product?.price)}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded">
                                        {calculateDiscountPercentage(product?.price, product?.sellingPrice)}% Off
                                    </span>
                                    <button
                                        className="bg-white text-gray-800 text-xs font-bold border-2 border-gray-200 px-3 py-1 rounded-full transition-colors duration-300 hover:bg-blue-100"
                                        onClick={(e) => handleAddToCart(e, product?._id)}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Column;
