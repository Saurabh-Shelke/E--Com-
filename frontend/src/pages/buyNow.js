import React, { useState, useEffect } from 'react';
import { MdCheckCircle } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import AddressForm from "../components/AddressForm";
import displayINRCurrency from "../helpers/displayCurrency";
import { uploadAddress } from "../helpers/uploadAddress";
import SummaryApi from '../common';


const BuyNow = ({authToken}) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasAddress, setHasAddress] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [address, setAddress] = useState({});
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState({});
    const [data, setData] = useState([]);



  

    const fetchUserDetails = async () => {
        try {
          const response = await fetch(SummaryApi.current_user.url, {
            method: "GET",
            credentials: "include", // Include cookies to send the token
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`, 
            },
          });
          const result = await response.json();
          if (result.success) {
            setUser(result.data);
    
            setIsLoggedIn(true);
            setHasAddress(!!result.data.address);
          } else {
            setIsLoggedIn(false);
            setHasAddress(false);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          setIsLoggedIn(false);
          setHasAddress(false);
        }
        
      };
      useEffect(() => {
        const buyNowProduct = localStorage.getItem('buyNowProduct');
        if (buyNowProduct) {
            const parsedProduct = JSON.parse(buyNowProduct);
            console.log(parsedProduct); // Log the parsed product directly
            setProduct(parsedProduct);
        }
        setLoading(false);
        fetchUserDetails()
    }, []);
    

    const handleAddNewAddress = () => {
        setShowAddressForm((prevState) => !prevState);
        if (!showAddressForm) {
            setAddress({ street: "", city: "", state: "", zip: "" });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        uploadAddress(address, setUserData, setShowAddressForm, setAddress);
        setShowAddressForm(false); // Hide the form after submission
      };;

    if (loading) {
        return <div>Loading...</div>;
    }
    // useEffect(() => {
    //      // Fetch user details including address
    //     fetchData(); // Fetch cart data
    //   }, []);
console.log(product)

   const handlePayment = async ({authToken}) => {
    if (!hasAddress) {
        alert("Add Delivery Address");
        return;
    }

    try {
        // Step 1: Create an order on the backend
        const response = await fetch(SummaryApi.createOrder_from_buynow.url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`, 
            },
            body: JSON.stringify({
                amount: product.sellingPrice, // in INR
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
                products: {
                    _id: product._id,
                    productName: product.productName,
                    sellingPrice: product.sellingPrice,
                    commissionPrice: product.commissionPrice,
                    productImage: product.productImage,
                    quantity: 1, // Default quantity
                },
                userId: user._id,
            }),
        });

        const responseData = await response.json();

        if (!responseData.success) {
            alert("Unable to create order. Please try again.");
            return;
        }

        // Step 2: Open Razorpay payment gateway
        const options = {
            key: "rzp_test_U4XuiM2cjeWzma", // Razorpay key_id
            amount: responseData.order.amount * 100, // Amount in paisa
            currency: responseData.order.currency,
            name: "YML Mart",
            description: "Payment for Order",
            image: "/logo.png",
            order_id: responseData.order.order_id, // order_id returned from backend
            handler: async function (response) {
                // Step 3: Send payment details to backend to store the order
                const paymentResponse = await fetch(SummaryApi.payment_Success.url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`, 
                    },
                    body: JSON.stringify({
                        order_id: response.razorpay_order_id,
                        payment_id: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                        userId: user._id,
                    }),
                });

                const paymentResult = await paymentResponse.json();

                if (paymentResult.success) {
                    alert("Payment Successful! Order has been stored.");
                } else {
                    alert("Payment was successful, but there was an issue storing the order. Please contact support.");
                }
            },
            prefill: {
                name: user?.name || "Your Name",
                email: user?.email || "Your Email Id",
                contact: user?.contact || "0000000000",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

        rzp.on("payment.failed", function (response) {
            alert("Payment Failed");
            console.error("Payment Failed:", response.error);
        });
    } catch (error) {
        console.error("Payment error:", error);
    }
};


    return (
        <div className="container mx-auto flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
            <div className="w-full lg:w-[70%] h-max-content bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="mb-6 p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">Login</h3>
                        <MdCheckCircle className="text-green-500 text-xl" />
                    </div>
                    {isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <p className="text-gray-700">{user?.name} ({user?.email})</p>
                        </div>
                    ) : (
                        <p className="text-red-500">Please log in to proceed.</p>
                    )}
                </div>

                <div className="mb-6 p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">Delivery Address</h3>
                        <MdCheckCircle className="text-green-500 text-xl" />
                    </div>
                    {hasAddress ? (
                        <div className="text-gray-700">
                            <p>
                                <strong>Street:</strong> {user?.address?.street}<br />
                                <strong>City:</strong> {user?.address?.city}<br />
                                <strong>State:</strong> {user?.address?.state}<br />
                                <strong>ZIP:</strong> {user?.address?.zip}
                            </p>
                        </div>
                    ) : (
                        <p className="text-red-500">No address provided.</p>
                    )}
                    <div className="flex items-center mt-4">
                        <IoIosAddCircle className="text-sky-500 text-xl" />
                        <button className="ml-2 text-blue-500 hover:text-blue-700" onClick={handleAddNewAddress}>
                            {showAddressForm ? "Cancel" : "Add New Address"}
                        </button>
                    </div>

                    {showAddressForm && (
                        <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
                            <AddressForm address={address} setAddress={setAddress} />
                            <button className="bg-green-600 text-white py-2 px-4 rounded-lg w-[300px]">Update Address</button>
                        </form>
                    )}
                </div>

                <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Payment</h3>
                    <button onClick={handlePayment} className="bg-green-600 text-white py-2 px-4 rounded-lg w-[300px]">Proceed to Payment</button>
                </div>
            </div>

            {/*** Right Column - Single Product Summary ***/}
            <div className="w-full lg:w-[30%] h-max-content bg-white border border-gray-200 rounded-lg shadow-lg p-6">
                {product ? (
                    <div className="flex flex-col items-center">
                        <img src={product.productImage} alt={product.name} className="w-[200px] h-[200px] object-cover mb-4" />
                        <h4 className="text-lg font-semibold text-gray-800">{product.brandName}</h4>
                        <h5 className="text-lg font-semibold text-gray-800">{product.category}</h5>
                        <p className="text-lg font-bold text-red-500">{displayINRCurrency(product.sellingPrice)}</p>
                        <p className="text-lg  text-gray-500 line-through">{displayINRCurrency(product.price)}</p>

                    </div>
                ) : (
                    <p>No product selected.</p>
                )}
            </div>
        </div>
    );
};

export default BuyNow;
