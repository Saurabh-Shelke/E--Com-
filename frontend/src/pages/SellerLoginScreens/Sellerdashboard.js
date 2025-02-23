import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from '../../common';

const SellerDashboard = () => {
    const [sellerData, setSellerData] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchSellerData = async () => {
            try {
                const response = await fetch(SummaryApi.sellerDetails.url, {
                    method: SummaryApi.sellerDetails.method,
                    headers: {
                        'Content-Type': 'application/json',
                        // Include token if necessary
                        'Authorization': `Bearer ${localStorage.getItem('sellerToken')}`,
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
                }

                const data = await response.json();
                setSellerData(data); // Assuming data comes in the format { data: ... }
                console.log(sellerData)
            } catch (error) {
                console.error("Error fetching seller details:", error);
                setError(error.message); // Set error state
            } finally {
                setLoading(false); // Set loading to false once the API call is done
            }
        };

        fetchSellerData(); // Call the fetch function
    }, []); // Empty dependency array to run on component mount

    // Render loading state
    if (loading) {
        return <h2>Loading...</h2>;
    }

    // Render error state
    if (error) {
        return <h2>Error: {error}</h2>;
    }

    return (
        <div>
            <h1>Welcome, {sellerData.data.email}</h1>
            {/* Render other seller data as needed */}
        </div>
    );
};

export default SellerDashboard;
