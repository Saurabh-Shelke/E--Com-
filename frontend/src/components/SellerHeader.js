import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from '../common';

const SellerHeader = () => {
  const navigate = useNavigate();

  // Check if the seller is logged in by checking the presence of the sellertoken in local storage
  const isSellerLoggedIn = Boolean(localStorage.getItem('sellerToken'));

  const handleLogout = async () => {
    try {
      const response = await fetch(SummaryApi.sellerLogout.url, {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },      });
  
      if (!response.ok) {
        throw new Error('Logout failed');
      }
  
      // Remove the token from local storage
      localStorage.removeItem('sellerToken');
  
      // Redirect to login page after logout
      navigate('/sellerlogin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  

  return (
    <div>
      <header className="h-16 shadow-md bg-white fixed w-full z-40">
        <div className="h-full container mx-auto flex items-center justify-between">
          <div className="h-full container mx-auto flex items-center">
            <Link to="/">
              <img src="Seller Partner.png" alt="Logo" className="w-48" />
            </Link>
          </div>
          
          {isSellerLoggedIn ? (
            <>

<Link to='/seller-panel/all-products' 
  className="px-4 py-2 w-36 m-2 rounded text-sm text-white bg-sky-600 hover:bg-sky-700 hover:text-white transition-colors duration-200 whitespace-nowrap text-center"

                >Go to Listing Panel</Link>
<Link to='/sellerdashboard'
  className="px-4 py-2 w-24 m-2 rounded text-sm text-white bg-sky-600 hover:bg-sky-700 hover:text-white transition-colors duration-200 whitespace-nowrap text-center"
>
  Dashboard
</Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2  w-24 m-2   rounded-full text-sm text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"

            >
                Logout

              </button></>
          ) : (
            <>
              <Link
                to="/become-seller"
                className="px-4 py-2 m-5 rounded-full text-sm text-white bg-sky-600 hover:bg-sky-700 transition-colors duration-200"
              >
                Register
              </Link>
              <Link
                to="/sellerlogin"
                className="px-4 py-2 rounded-full text-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
};

export default SellerHeader;
