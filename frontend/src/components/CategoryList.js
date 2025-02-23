import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { Link } from 'react-router-dom';
import productCategory from '../helpers/productCategory'; // Assuming productCategory is an array with subcategories for each category
import personalCareImage from '../assest/CategoryImgs/Personal Care.jpg';
import homeCareImage from '../assest/CategoryImgs/Beauty.jpg';
import medicinesImage from '../assest/CategoryImgs/Beauty.jpg';
import fruitsImage from '../assest/CategoryImgs/Beauty.jpg';
import beautyImage from '../assest/CategoryImgs/Beauty.jpg';
import stationaryImage from '../assest/CategoryImgs/Stationary.jpg';
import electronicsImage from '../assest/CategoryImgs/Electronics.jpg';
import homeDecorImage from '../assest/CategoryImgs/Home Decor.jpg';
import groceriesImage from '../assest/CategoryImgs/Groceries.jpg';
import gifthampersImage from '../assest/CategoryImgs/Gifts & Hampers.jpg';
import kitchenwareImage from '../assest/CategoryImgs/Kitchenware.jpg';
import toysandgamesImage from '../assest/CategoryImgs/toys and games.jpg';
import fashion from '../assest/CategoryImgs/fashion.jpg'



const CategoryList = () => {

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
        "gifts, hampers": gifthampersImage,
        "kitchenware": kitchenwareImage,
        "toys, games": toysandgamesImage,
        "fashion": fashion
    };
    const [categoryProduct, setCategoryProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null); // To track the hovered category
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 }); // Position for the dropdown
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); // To manage dropdown visibility
    const [lastScrollY, setLastScrollY] = useState(0); // Track the last scroll position

    const categoryLoading = new Array(20).fill(null);

    const fetchCategoryProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.categoryProduct.url);
            const dataResponse = await response.json();
            let products = Array.isArray(dataResponse.data) ? dataResponse.data : [];
    
            // Move 'grocery' category to the first position
            products = products.sort((a, b) => {
                if (a.category.toLowerCase() === 'groceries') return -1;
                if (b.category.toLowerCase() === 'groceries') return 1;
                return 0;
            });
    
            setCategoryProduct(products);
        } catch (error) {
            console.error("Failed to fetch category products:", error);
            setCategoryProduct([]); // Set an empty array on error to prevent map errors
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchCategoryProduct();
    }, []);

    // Helper to get subcategories for a product category from productCategory.js
    const getSubcategories = (category) => {
        const categoryData = productCategory.find(
            (cat) => cat.value.toLowerCase() === category?.toLowerCase() // Ensure both values are compared in lowercase
        );
        return categoryData ? categoryData.subcategories : [];
    };

    // Handle setting the position of the dropdown relative to the hovered category
    const handleMouseEnter = (event, category) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const dropdownWidth = 256; // Width of the dropdown
        const dropdownHeight = 256; // Height of the dropdown
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate default positions
        let top = rect.bottom + window.scrollY;
        let left = rect.left + window.scrollX;

        // Adjust position if dropdown goes out of viewport
        if (left + dropdownWidth > viewportWidth) {
            left = viewportWidth - dropdownWidth;
        }
        if (top + dropdownHeight > viewportHeight) {
            top = rect.top + window.scrollY - dropdownHeight;
        }

        setDropdownPosition({ top, left });
        setHoveredCategory(category);
        setIsDropdownVisible(true);
    };

    // Handle hiding dropdown when mouse leaves category or dropdown
    const handleMouseLeave = () => {
        setTimeout(() => {
            if (!dropdownElementHovered && !categoryElementHovered) {
                setIsDropdownVisible(false);
                setHoveredCategory(null);
            }
        }, 100);
    };

    let dropdownElementHovered = false;
    let categoryElementHovered = false;

    // Scroll event listener to show/hide the dropdown based on scroll direction
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // If scrolling down, hide the dropdown
            if (currentScrollY > lastScrollY) {
                setIsDropdownVisible(false);
            }

            // Save the current scroll position
            setLastScrollY(currentScrollY);
        };

        // Add the scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up the scroll event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    // Close dropdown when the mouse is not over the dropdown or the category
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.category-item') && !event.target.closest('.dropdown-item')) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className="container pt-5 pb-8">
        {/* Dynamic Category Listing */}
        <div className="flex items-center gap-4 justify-between overflow-x-auto bg-white px-6 rounded-lg shadow-lg">
            {loading ? (
                categoryLoading.map((_, index) => (
                    <div
                        className="h-16 w-16 md:w-20 md:h-20 rounded-full bg-slate-200 animate-pulse"
                        key={"categoryLoading" + index}
                    ></div>
                ))
            ) : (
                categoryProduct.map((product) => (
                    <div
                        key={product?.category || product?._id} // Use a unique key if possible
                        className="relative group category-item"
                        onMouseEnter={(e) => {
                            handleMouseEnter(e, product?.category);
                            categoryElementHovered = true;
                        }}
                        onMouseLeave={() => {
                            categoryElementHovered = false;
                            handleMouseLeave();
                        }}
                    >
                        <Link
                            to={"/product-category?category=" + product?.category}
                            className="cursor-pointer"
                        >
                            <div className="flex flex-col items-center py-3">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center">
                                    <img
                                        src={
                                            categoryImages[product?.category.toLowerCase()] ||
                                            categoryImages["default"]
                                        }
                                        alt={product?.productName || "Product Image"}
                                        className="h-full object-scale-down hover:scale-125 transition-transform"
                                    />
                                </div>
                                <p className="text-center text-sm md:text-base capitalize">
                                    {product?.category}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))
            )}
        </div>

        {/* Dropdown for Subcategories */}
        {isDropdownVisible && (
            <div
                className="fixed z-50 bg-white shadow-lg p-4 rounded-lg w-48 border border-gray-300 overflow-y-auto max-h-64 mt-2 dropdown-item"
                style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                onMouseEnter={() => {
                    dropdownElementHovered = true;
                    setIsDropdownVisible(true);
                }}
                onMouseLeave={() => {
                    dropdownElementHovered = false;
                    handleMouseLeave();
                }}
            >
                {getSubcategories(hoveredCategory).length > 0 ? (
                    getSubcategories(hoveredCategory).map((subcategory) => (
                        <Link
                            key={subcategory.id}
                            to={"/product-category?" + "subcategory=" + subcategory?.value}
                            className="block px-4 py-2 text-sm hover:bg-gray-200"
                        >
                            {subcategory.label}
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-sm text-gray-500">No subcategories</p>
                )}
            </div>
        )}
    </div>
    );
};

export default CategoryList;