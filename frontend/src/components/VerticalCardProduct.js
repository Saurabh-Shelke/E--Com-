import React, { useContext, useEffect, useRef, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context/index';

const VerticalCardProduct = ({ category, heading }) => {
    const { authToken } = useContext(Context); // Get the authToken from Context

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadingList = new Array(13).fill(null);

    const scrollElement = useRef();

    const { fetchUserAddToCart } = useContext(Context);

    const handleAddToCart = async (e, id) => {
        e.stopPropagation();  // Stop event propagation to prevent Link navigation
        await addToCart(e, id, authToken);
        if (fetchUserAddToCart) {
            fetchUserAddToCart(); // Call fetchUserAddToCart after adding the product to the cart
        } else {
            console.error('fetchUserAddToCart is not available in context');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const categoryProduct = await fetchCategoryWiseProduct(category);
            setData(Array.isArray(categoryProduct?.data) ? categoryProduct.data : []);
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

    // Handle right scroll
    const scrollRight = () => {
        const scrollAmount = 300;
        scrollElement.current.scrollLeft += scrollAmount;
    };

    // Handle left scroll
    const scrollLeft = () => {
        const scrollAmount = 300;
        scrollElement.current.scrollLeft -= scrollAmount;
    };

    // Calculate discount percentage
    const calculateDiscountPercentage = (originalPrice, sellingPrice) => {
        if (!originalPrice || !sellingPrice) return 0;
        const discount = ((originalPrice - sellingPrice) / originalPrice) * 100;
        return Math.round(discount);
    };

    return (
        <div className='container mx-auto px-5 sm:px-10 my-6 relative'>
            <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

            {/* Scroll buttons */}
            <button
                className='bg-white shadow-md rounded-full p-1 absolute left-2 top-1/2 transform -translate-y-1/2 text-lg md:flex justify-center items-center z-10'
                onClick={scrollLeft}
            >
                <FaAngleLeft />
            </button>
            <button
                className='bg-white shadow-md rounded-full p-1 absolute right-2 top-1/2 transform -translate-y-1/2 text-lg md:flex justify-center items-center z-10'
                onClick={scrollRight}
            >
                <FaAngleRight />
            </button>

            {/* Products Slider */}
            <div
                ref={scrollElement}
                className='flex gap-5 overflow-x-auto scrollbar-none'
                style={{
                    scrollBehavior: 'smooth', // Ensure smooth scrolling behavior
                }}
            >
                {loading ? (
                    loadingList.map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg">
                            <div className="bg-slate-200 h-36 p-2 flex justify-center items-center animate-pulse"></div>
                            <div className="p-2 space-y-2">
                                <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                                <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                                <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    data.map((product, index) => {
                        const discountPercentage = calculateDiscountPercentage(product?.price, product?.sellingPrice);

                        return (
                            <Link
                                key={index}
                                to={`/product/${product?._id}`}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                                style={{ minWidth: '170px', maxWidth: '170px' }} // Adjust card width for smaller screens
                            >
                                <div className="relative h-28 px-2 pt-2 flex justify-center items-center">
                                    <img
                                        src={product.productImage[0]}
                                        className="object-contain h-full w-full transition-transform duration-300 hover:scale-105"
                                        alt={product?.productName}
                                    />
                                    {discountPercentage > 0 && (
                                    <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-lg">
                                    {discountPercentage}% Off
                                    </span>
                            )}
                                </div>
                                <div className="px-4 pt-2 pb-3 h-30 space-y-1">
                                    <h3 className="text-xs md:text-sm font-semibold text-gray-800 truncate">
                                        {product?.productName}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-green-700 text-xs font-semibold">
                                            {displayINRCurrency(product?.sellingPrice)}
                                        </p>
                                        <p className="text-slate-400 text-xs line-through">
                                            {displayINRCurrency(product?.price)}
                                        </p>
                                    </div>
                                    <div className="flex justify-center pt-1">
                                        {product?.quantity > 0 ? (
                                           <button
                                           className="bg-white text-black text-xs font-bold border-2 border-black-200 px-4 py-2 w-full rounded-full transition-colors duration-300 hover:bg-green-100 hover:text-green-600"
                                           onClick={(e) => handleAddToCart(e, product?._id)}
                                       >
                                           Add
                                       </button>
                                       
                                        ) : (
                                            <button
                                               className="bg-white text-black text-xs font-bold border border-black-200 px-2 py-1 rounded-full transition-colors duration-300 hover:bg-green-100 hover:text-green-600"
                                            >
                                               Add to Cart
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default VerticalCardProduct;
