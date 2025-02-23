import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SummaryApi from '../common';
import { FaStar, FaStarHalf } from "react-icons/fa";
import displayINRCurrency from '../helpers/displayCurrency';
import VerticalCardProduct from '../components/VerticalCardProduct';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context/index';
import { toast } from 'react-toastify';


const ProductDetails = () => {
  // State initialization
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    soldBy: '',
    features: '',
    specifications: '',
    price: "",
    sellingPrice: "",
    ratingsCount: 0
  });
  
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState("");
  const { authToken } = useContext(Context);
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 });
  const [zoomImage, setZoomImage] = useState(false);
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false); // State to manage visibility of product details

  const toggleShowMore = () => {
    setShowMore(!showMore); // Toggle visibility
  };

  // Fetch product details from API
  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.productDetails.url, {
        method: SummaryApi.productDetails.method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId: params?.id })
      });
      const dataResponse = await response.json();
      const ratingsCount = getPersistedRatingsCount(params?.id);
      setData({ ...dataResponse?.data, ratingsCount });
      setActiveImage(dataResponse?.data?.productImage[0]);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };


  // Get persisted ratings count from localStorage
  const getPersistedRatingsCount = (productId) => {
    const storedRatings = localStorage.getItem(`ratings_${productId}`);
    if (storedRatings) {
      return JSON.parse(storedRatings);
    } else {
      const newRatingsCount = generateRandomRatings();
      localStorage.setItem(`ratings_${productId}`, JSON.stringify(newRatingsCount));
      return newRatingsCount;
    }
  };

  const generateRandomRatings = () => {
    return Math.floor(Math.random() * (1500 - 1000 + 1)) + 1000;
  };
  

  // Calculate discount percentage
  const calculateDiscountPercentage = (price, sellingPrice) => {
    if (!price || !sellingPrice) return 0;
    return Math.round(((price - sellingPrice) / price) * 100);
  };

  // Effect to fetch product details on component mount and params change
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductDetails();
  }, [params]);

  // Event handlers
  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true);
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setZoomImageCoordinate({ x, y });
  }, []);

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

const handleAddToCart = async (e, id) => {
        // Retrieve authToken (e.g., from localStorage or cookies)
        const authToken = localStorage.getItem("authToken") || null;
    
        // Check if the token is valid
        const isLoggedIn = authToken && isValidToken(authToken);
    
        if (isLoggedIn) {
            e.stopPropagation();
            await addToCart(e, id, authToken); // This adds the product to the cart (logged-in user)
        } else {
            // Guest user flow: Fetch product details
            const localCart = JSON.parse(localStorage.getItem("guestCart")) || [];
            const productDetails = await fetchProductDetailsGuest(id); // Fetch product details from the server or a local file
    
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
                toast.success("Product added to cart");

            }
            console.log(productDetails)

        }
    };
    
    // Utility function to fetch product details by productId
   const fetchProductDetailsGuest = async (productId) => {
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
const isValidToken = (token) => {
  try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      return payload.exp * 1000 > Date.now(); // Check expiration
  } catch {
      return false; // Invalid token
  }
};

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id);
    navigate("/cart");
  };

  // Render component
  return (
    <div className='container mx-auto p-4'>
      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>
        
        {/* Product Image Section */}
        <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>
          <div className='h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 relative p-2'>
            <img
              src={activeImage}
              className='h-full w-full object-scale-down mix-blend-multiply'
              onMouseMove={handleZoomImage}
              onMouseLeave={handleLeaveImageZoom}
            />
            {zoomImage && (
              <div className='hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-200 p-1 -right-[510px] top-0'>
                <div
                  className='w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150'
                  style={{
                    background: `url(${activeImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`
                  }}
                />
              </div>
            )}
          </div>
          <div className='h-full'>
            {loading ? (
              <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                {productImageListLoading.map((_, index) => (
                  <div className='h-20 w-20 bg-slate-200 rounded animate-pulse' key={`loadingImage${index}`}></div>
                ))}
              </div>
            ) : (
              <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                {data?.productImage?.map((imgURL, index) => (
                  <div className='h-20 w-20 bg-slate-200 rounded p-1' key={imgURL}>
                    <img
                      src={imgURL}
                      className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer'
                      onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                      onClick={() => handleMouseEnterProduct(imgURL)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Details Section */}
        {loading ? (
          <div className='grid gap-1 w-full'>
            {/* Loading skeleton could go here */}
          </div>
        ) : (
          <div className='flex flex-col gap-1'>
            <p className='bg-sky-200 text-sky-600 px-2 rounded-full inline-block w-fit'>{data?.brandName}</p>
            <h2 className='text-2xl lg:text-4xl font-medium'>{data?.productName}</h2>
            <p className='capitalize text-slate-400'>{data?.category}</p>
            <div className="text-yellow-400 flex items-center gap-1">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalf />
              {/* Display the persisted rating count */}
              <span className="ml-2">({data.ratingsCount})</span>
            </div>
            <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1'>
              <p className='text-green-600'>{displayINRCurrency(data.sellingPrice)}</p>
              <p className='text-slate-400 line-through'>{displayINRCurrency(data.price)}</p>
              <p className='bg-green-100 text-green-600 text-sm px-3 py-1.5 rounded-lg'>{calculateDiscountPercentage(data.price, data.sellingPrice)}% Off</p> {/* Discount Percentage */}
            </div>
            {data?.quantity > 0 ? (
              <button className='border-2 border-sky-600 rounded px-2 py-1 w-48 font-medium text-white bg-sky-600 hover:text-sky-600 hover:bg-white' onClick={(e) => handleAddToCart(e, data?._id)}>Add To Cart</button>
            ) : (
              <span className="text-red-600 text-2xl font-bold">
                Out of Stock
              </span>
            )}
            <div className='flex flex-col mt-4'>
      <p className='text-slate-600 font-medium my-1'>Description:</p>
      <p>{data?.description}</p>

      <p className='text-slate-600 font-medium my-1'>Sold By:</p>
      <p>{data?.soldBy}</p>

      <p className='text-slate-600 font-medium my-1'>Features:</p>
      <p>{data?.features}</p>

      <p className='text-slate-600 font-medium my-1'><strong>Product Details:</strong></p>

      {/* Show product details only when "Read More" is clicked */}
      {showMore ? (
        <div>
          {data?.productInfo?.split('\n').map((line, index) => {
            const [key, value] = line.split('\t'); // Split by tab character '\t'
            return (
              <p key={index}>
                <strong className='text-slate-600 font-medium my-1'>{key}</strong>: {value}
              </p>
            );
          })}
          {/* Button to show less */}
          <button className='text-sky-600 mt-2' onClick={toggleShowMore}>Read Less</button>
        </div>
      ) : (
        // Button to show more
        <button className='text-sky-600 mt-2 justify-start flex' onClick={toggleShowMore}>Read More</button>
      )}
    </div>
          </div>
        )}
      </div>

      {data.category && (
        <CategroyWiseProductDisplay category={data?.category} heading={"Recommended Product"} />
      )}
    </div>
  );
};

export default ProductDetails;
