import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { Link } from 'react-router-dom';
import personalCareImage from '../assest/Images/Personal Care/8.jpeg';
import homeCareImage from '../assest/Images/Home Care/5.jpeg';
import medicinesImage from '../assest/Images/Medicines/7.jpeg';
import fruitsImage from '../assest/Images/fruits/3.jpeg';
import beautyImage from '../assest/CategoryImgs/Beauty.jpg';
import stationaryImage from '../assest/Images/Stationary/10.jpeg';
import electronicsImage from '../assest/Images/Electronics/2.jpeg';
import homeDecorImage from '../assest/Images/Kitchen/11.jpeg';
import groceriesImage from '../assest/Images/Groceries/4.png';
import fashion from '../assest/CategoryImgs/fashion.jpg'

const categoryImages = {
    "personal care": personalCareImage,
    "home care": homeCareImage,
    "medicines": medicinesImage,
    "fruits": fruitsImage,
    "beauty": beautyImage,
    "stationary": stationaryImage,
    "electronics": electronicsImage,
    "home decor": homeDecorImage,
    "groceries": groceriesImage,
    "fashion": fashion
};

const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([]);
    const [loading, setLoading] = useState(false);

    const categoryLoading = new Array(13).fill(null);

    const fetchCategoryProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.categoryProduct.url);
            const dataResponse = await response.json();

            
            setCategoryProduct(Array.isArray(dataResponse.data) ? dataResponse.data : []);
        } catch (error) {
            console.error("Failed to fetch category products:", error);
            setCategoryProduct([]); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryProduct();
    }, []);

    return (
        <div className='container mx-auto py-5 px-8'>
            <div className='flex items-center gap-4 justify-between overflow-scroll scrollbar-none'>
                    {loading ? (
                        categoryLoading.map((_, index) => (
                            <div
                                className='h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse'
                                key={"categoryLoading" + index}
                            ></div>
                        ))
                    ) : (
                        categoryProduct.map((product) => (
                            
                            <Link
                                to={"/product-category?category=" + product?.category}
                                
                                className='cursor-pointer'
                                key={product?.category || product?._id} // Use a unique key if possible
                            >
                                
                                <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center'>
                                    <img
                                        src={categoryImages[product?.category.toLowerCase()] || categoryImages["default"]}
                                        alt={product?.productName || 'Product Image'} // More descriptive alt text
                                        className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'
                                    />
                                </div>
                                <p className='text-center text-sm md:text-base capitalize'>
                                    {product?.category}
                                </p>
                            </Link>
                        ))
                    )}
            </div>
        </div>
    );
};

export default CategoryList;
