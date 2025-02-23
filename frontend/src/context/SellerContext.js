// SellerContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import { useDispatch } from 'react-redux';
import { setSellerDetails } from '../store/sellerSlice';

const SellerContext = createContext();

export const SellerProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [seller, setSeller] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('sellerToken'));

  const fetchSellerDetails = async (authToken) => {
    try {
      if (!authToken) {
        console.error("No auth token found");
        return;
      }

      const response = await fetch(SummaryApi.sellerDetails.url, {

        method: SummaryApi.sellerDetails.method,
        headers: {
            'Content-Type': 'application/json',
            // Include token if necessary
            'Authorization': `Bearer ${localStorage.getItem('sellerToken')}`,
        },
    });

      const dataApi = await response.json();
      if (dataApi.success) {
        dispatch(setSellerDetails(dataApi.data));
        console.log(dataApi)
        setSeller(dataApi.data);
      }
    } catch (error) {
      console.error('Error fetching seller details:', error);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchSellerDetails(authToken);
    }
  }, [authToken]);

  return (
    <SellerContext.Provider value={{ seller, fetchSellerDetails, authToken, setAuthToken }}>
      {children}
    </SellerContext.Provider>
  );
};

export const useSeller = () => useContext(SellerContext);
