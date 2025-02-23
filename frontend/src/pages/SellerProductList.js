import React, { useEffect, useState } from 'react';
import UploadProduct from '../components/UploadProduct';
import SummaryApi from '../common';
import AdminProductCard from '../components/AdminProductCard';
import Loader from '../components/Loader';
import productCategory from '../helpers/productCategory'; 
import {useSeller} from "../context/SellerContext"
// Assuming you export productCategory from a separate file

const SellerProductList = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [selectedCategory, setSelectedCategory] = useState(''); // State for the selected category
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const itemsPerPage = 20; // Number of items to show per page
  const { seller } = useSeller(); // Get seller data from context


  // Fetch all products
  const fetchAllProduct = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch(`${SummaryApi.allSellerProduct.url}?sellerId=${seller._id}`);
      const dataResponse = await response.json();
      console.log("product data", dataResponse);
      setAllProduct(dataResponse?.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false); // Set loading to false when fetching ends
    }
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  // Filter products based on the selected category
  const filteredProducts = selectedCategory
    ? allProduct.filter(product => product.category === selectedCategory)
    : allProduct; // If no category is selected, show all products

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get the products for the current page
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className='bg-white py-2 px-4 flex justify-between items-center'>
        <h2 className='font-bold text-lg'>All Product</h2>
        <button
          className='border-2 border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white transition-all py-1 px-3 rounded-full'
          onClick={() => setOpenUploadProduct(true)}
        >
          Upload Product
        </button>
      </div>

      {/* Category Buttons */}
      <div className='flex justify-center py-4'>
        <button
          className={`border-2 mx-2 px-1 rounded-full ${
            selectedCategory === '' ? 'bg-black text-white' : 'border-black text-black'
          }`}
          onClick={() => setSelectedCategory('')}
        >
          All Categories
        </button>
        {productCategory.map((category) => (
          <button
            key={category.id}
            className={`border-2 mx-2 px-1 rounded-full ${
              selectedCategory === category.value ? 'bg-black text-white ' : 'border-black text-black text-xs'
            }`}
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>
      <div className='flex justify-center items-center py-4 space-x-2'>
        <button
          className='px-3 py-1 bg-gray-300 rounded hover:bg-gray-400'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className='px-3 py-1 bg-gray-300 rounded hover:bg-gray-400'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {/* Display Products */}
      <div className='flex items-center flex-wrap gap-5 py-4 overflow-y-hidden scroll-smooth '>
        {loading ? (
          <div className='flex justify-center items-center w-full h-full'>
            <Loader />
          </div>
        ) : currentProducts.length > 0 ? (
          currentProducts.map((product, index) => (
            <AdminProductCard data={product} key={index + "allProduct"} fetchdata={fetchAllProduct} />
          ))
        ) : (
          <div className='w-full text-center text-gray-500'>
            No products found in this category.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className='flex justify-center items-center py-4 space-x-2'>
        <button
          className='px-3 py-1 bg-gray-300 rounded hover:bg-gray-400'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className='px-3 py-1 bg-gray-300 rounded hover:bg-gray-400'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Upload Product Modal */}
      {openUploadProduct && (
        <UploadProduct onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProduct} />
      )}
    </div>
  );
};

export default SellerProductList;
