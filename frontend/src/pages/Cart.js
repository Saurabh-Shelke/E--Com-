import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdCheckCircle, MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import Context from "../context/";
import { useUser } from '../context/userContext'; // Import the useUser hook
import { useCart } from '../context/CartContext';
import { uploadAddress } from "../helpers/uploadAddress";
import axios from "axios";
import Loader from "../components/Loader";



const Cart = () => {
  const { authToken } = useContext(Context); // Get the authToken from Context

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser(); // Assuming setUser is available to update user context
  const { updateCartProductCount } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const [hasAddress, setHasAddress] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0); 
  const [selectedAddress, setSelectedAddress] = useState(user?.address[0]); 
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [streetSuggestions, setStreetSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

   const validPincodes = [
    "411057",
    "411033",
    "411028",
    "411013",
    "410506",
    "412303",
    "412108",
    "411014",
    "411009",
    "411001"
  ];
  const [address, setAddress] = useState({
    name: "",
    mobileNo: "",
    street: "",
    city: "Pune",  // Prefill with "Pune"
    state: "Maharashtra",  // Prefill with "Maharashtra"
    zip: "",
  });


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  

    // Check if the state is Maharashtra (it should always be)
    if (address.state !== "Maharashtra") {
      alert("Please enter an address in Maharashtra");
      return;
    }

    if (!validPincodes.includes(address.zip)) {
      alert("Delivery is not available for this pincode.");
      return;
    }

    // Here, you can update the user data with the new address
    try {
      await uploadAddress(address, setUserData, authToken); // Upload the new address
  
      // After uploading, fetch the updated user data with the latest addresses
      const updatedUser = { ...user, address: [...user.address, address] }; // Add the new address to the user's address array locally
  
      setUser(updatedUser); // Update the user in context to trigger a re-render
    } catch (error) {
      console.error("Error uploading address:", error);
    }
  

    // Close the address form after submission
    setShowAddressForm(false);
  };

  // Fetch street suggestions from Nominatim for Maharashtra
  const fetchStreetSuggestions = async (query) => {
    if (query.length < 3) return;  // Avoid too many API calls for short queries
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?street=${query}&state=Maharashtra&countrycodes=IN&format=json`
      );
      setStreetSuggestions(response.data.map((item) => item.display_name));
    } catch (error) {
      console.error("Error fetching street suggestions:", error);
    }
  };

  // Fetch city suggestions for Maharashtra only
  const fetchCitySuggestions = async (query) => {
    if (query.length < 3) return;
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?city=${query}&state=Maharashtra&countrycodes=IN&format=json`
      );
      setCitySuggestions(response.data.map((item) => item.display_name));
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  };

  // Update street input and fetch suggestions
  const handleStreetChange = (e) => {
    const { value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, street: value }));
    fetchStreetSuggestions(value);
  };

  // Update city input and fetch suggestions
  const handleCityChange = (e) => {
    const { value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, city: value }));
    fetchCitySuggestions(value);
  };

  const handlePincodeChange = (e) => {
    const newPincode = e.target.value;

    setAddress((prev) => ({ ...prev, zip: newPincode }));

    // Check if the pincode is valid
    if (!validPincodes.includes(newPincode)) {
      setErrorMessage('Delivery is not available for this pincode');
    } else {
      setErrorMessage('');
    }
  };

  // Toggle the address form
  const handleAddNewAddress = () => {
    setShowAddressForm((prevState) => !prevState);

    if (!showAddressForm) {
      setAddress({
        name: "", 
        mobileNo: "", 
        street: "", 
        city: "Pune", 
        state: "Maharashtra", 
        zip: ""
      });
    }
  };

  const deleteAddress = async (id, userId) => {
    try {
      const response = await fetch(SummaryApi.deleteAddress.url, {
        method: SummaryApi.deleteAddress.method,
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`, 
        },
        body: JSON.stringify({
          AddressId: id,
          userId: userId,
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        setUserData((prevData) => ({
          ...prevData,
          address: responseData.data?.address || [], // Ensure address is always an array
        }));
        alert("Address deleted successfully");
        setShowAllAddresses(false); // Hide form once an address is selected


      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to delete address");
    }
  };

  // Handle address selection
  const handleSelectAddress = (addres) => {
    setSelectedAddress(addres);
    setShowAllAddresses(false); // Hide form once an address is selected
  };
  const fetchData = async (authToken) => {
    try {
      let cartData;
  
      if (authToken) {
        // Fetch data from the server if the user is logged in
        const response = await fetch(SummaryApi.addToCartProductView.url, {
          method: SummaryApi.addToCartProductView.method,
          credentials: "include",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
  
        const responseData = await response.json();
        if (responseData.success) {
          cartData = responseData.data; // Assign data to cartData
          console.log(cartData)
        } else {
          console.error("Failed to fetch cart data from server");
          cartData = []; // Default to empty array if server fetch fails
        }
      } else {
        // Fetch data from localStorage if the user is not logged in
        const localCartData = localStorage.getItem("guestCart");
        cartData = localCartData ? JSON.parse(localCartData) : [];
        console.log(cartData)
      }
  
      setData(cartData || []); // Update state with cart data
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      setHasAddress(!!user.address);
      setSelectedAddress(user?.address[0]);
    }
    fetchData(authToken); // Fetch cart data
  }, [user, authToken]);
  

  useEffect(() => {
    if (!loading && data.length > 0) {
      const validProducts = data.filter(
        (product) => 
          product.productId && 
          product.productId.quantity > 0 &&
          product.productId.quantity >= product.quantity
      );
      const total = validProducts.reduce((previousValue, currentValue) => {
        return previousValue + (currentValue.quantity * currentValue.productId.sellingPrice);
      }, 0);
      setTotalPrice(total);
      setFinalAmount(total);
    }
  }, [data, loading]);
  
  const totalQty = data
    .filter(product => product.productId && product.productId.quantity > 0 && product.quantity > 0)
    .reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);

  const increaseQty = async (id, qty, prdId) => {
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
        'Authorization': `Bearer ${authToken}`, 

      },
      body: JSON.stringify({
        _id: id,
        quantity: qty + 1,
        productId: prdId,
      }),
    });
  
    const responseData = await response.json();
    if (responseData.success) {
      fetchData(authToken); // Refresh the cart data
    } else {
      alert(responseData.message);
    }
  };
  
  const decreaseQty = async (id, qty, prdId) => {
    if (qty > 1) {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
          'Authorization': `Bearer ${authToken}`, 

        },
        body: JSON.stringify({
          _id: id,
          quantity: qty - 1,
          productId: prdId,
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        fetchData(authToken); // Refresh the cart data
      } else {
        alert(responseData.message);
      }
    }
  };
  const deleteCartProduct = async (id) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
        'Authorization': `Bearer ${authToken}`, 

      },
      body: JSON.stringify({
        _id: id,
      }),
    });

    const responseData = await response.json();
    if (responseData.success) {
      fetchData(authToken);
      // updateCartProductCount(authToken);
    }
  };
  
  const handlePayment = async (finalAddress) => {
    if (!validPincodes.includes(selectedAddress.zip)) {
      alert("Delivery is not available for this pincode.");
      return;
    }

    if (!selectedAddress) {
      alert("Add Delivery Address");
    } else {
      try {
        const validProducts = data.filter(
          (product) =>
            product.productId.quantity > 0 &&
            product.productId.quantity >= product.quantity
        );

        if (validProducts.length === 0) {
          alert("No valid products in your cart.");
          return;
        }

        const totalAmount = validProducts.reduce((prev, curr) => {
          return prev + (curr.quantity * curr.productId.sellingPrice);
        }, 0);

        const response = await fetch(SummaryApi.createOrder.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalAmount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            products: validProducts,
            userId: data[0].userId,
            deliveryAddress: finalAddress,
          }),
        });

        const responseData = await response.json();
        if (!responseData.success) {
          alert("Unable to create order.");
          return;
        }


        const options = {
          key: 'rzp_live_j5FzhaF8uVrDAU',
          amount: responseData.order.amount,
          currency: responseData.order.currency,
          name: "YML Mart",
          description: "Payment for Order",
          image: "/logo.png",
          order_id: responseData.order.id,
          handler: async function (response) {
            const paymentResponse = await fetch(SummaryApi.payment_Success.url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                userId: data[0].userId,
                products: validProducts,
                amount: totalAmount,
                currency: "INR",
              }),
            });

            const paymentResult = await paymentResponse.json();
            if (paymentResult.success) {
              alert("Payment Successful!");
              setData([])
              if (paymentResult.invoiceUrl) {
                window.open(paymentResult.invoiceUrl, "_blank"); // Open invoice in a new tab
              }

              try {

                const response = await fetch(SummaryApi.clear_cart.url, {
                  method: SummaryApi.clear_cart.method,
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`, // Send the user token
                  },
                //  body: JSON.stringify({ userId: user._id }) // Pass userId in the request body

                });
          
                const result = await response.json();
                if (result.success) {
                  console.log(result.message);
                } else {
                  console.error("Failed to clear cart on server.");
                }
              } catch (error) {
                console.error("Error while clearing cart:", error);
              }
            } else {
              alert("Payment successful, but order storing failed.");
            }
          },
          prefill: {
            name: user?.name || "Your Name",
            email: user?.email || "Your Email",
            contact: user?.contact || "Your No.",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        rzp.on("payment.failed", function (response) {
          alert("Payment Failed");
        });
      } catch (error) {
        console.error("Payment error:", error);
      }
    }
  };


  return (
   <div className="container mx-auto flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
  {/*** Left Column - LOGIN, Delivery Address, Payment ***/}
  <div className="w-full lg:w-[70%] h-max-content bg-white border border-gray-200 rounded-lg shadow-lg">
    {/* LOGIN Section */}
    <div className=" p-6 border-b border-gray-200">
      <div className="flex items-center gap-2 ">
        <h3 className="text-xl font-semibold text-gray-800">Login</h3>
        <MdCheckCircle className="text-green-500 text-xl" />
      </div>
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <p className="text-gray-700">
            {user?.name}
          </p>
        </div>
      ) : (
        <p className="text-red-500">Please log in to proceed.</p>
      )}
    </div>

    {/* Delivery Address */}
    <div className="mb-6 p-6 border-b border-gray-200">

    <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xl font-semibold text-gray-800">Delivery Address</h3>
        <MdCheckCircle className="text-green-500 text-xl" />
        
      </div>
    {selectedAddress ? (
        <div className="text-gray-700 flex gap-10">
          <p>
          {selectedAddress?.name}, {selectedAddress?.mobileNo}, <br />
            {selectedAddress?.street}, {selectedAddress?.city}, <br />
            {selectedAddress?.state}, <strong>{selectedAddress?.zip}</strong>
          </p>
          </div>
      ) : (
        <p className="text-red-500">No address provided.</p>
      )}
          <div className="flex items-center mt-4">
        <button
          className="ml-2  text-sky-600 hover:text-sky-700"
          onClick={() => setShowAllAddresses(!showAllAddresses)}
        >
          {showAllAddresses ? 'Hide Addresses' : 'Change Address'}
        </button>

                <IoIosAddCircle className="text-sky-500 text-xl ml-2" />
                <button
          className=" text-sky-600 hover:text-sky-700"
          onClick={handleAddNewAddress}
                >
                  {showAddressForm ? "Cancel" : "Add New Address"}
                </button>
      </div>
      
      {showAddressForm && (
  <form className="grid gap-4 mt-4 max-w-lg " onSubmit={handleSubmit}>
    {/* Name and Mobile Number */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={address.name}
        onChange={(e) => setAddress((prev) => ({ ...prev, name: e.target.value }))}
        className="border p-2 rounded-lg"
        required
      />
      <input
        type="text"
        name="mobileNo"
        placeholder="Mobile Number"
        value={address.mobileNo}
        onChange={(e) => setAddress((prev) => ({ ...prev, mobileNo: e.target.value }))}
        className="border p-2 rounded-lg"
        required
      />
    </div>

    {/* Street and City */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={address.street}
          className="border p-2 rounded-lg w-full"
          required
          onChange={handleStreetChange}
        />
        {streetSuggestions.length > 0 && (
          <ul className="border border-gray-300 p-2 rounded-lg bg-white">
            {streetSuggestions.map((suggestion, idx) => (
              <li
                key={idx}
                className="p-1 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setAddress((prev) => ({ ...prev, street: suggestion }));
                  setStreetSuggestions([]); // Close dropdown
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleCityChange}
          className="border p-2 rounded-lg w-full"
          required
          readOnly
        />
        {citySuggestions.length > 0 && (
          <ul className="border border-gray-300 p-2 rounded-lg bg-white">
            {citySuggestions.map((suggestion, idx) => (
              <li
                key={idx}
                className="p-1 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setAddress((prev) => ({ ...prev, city: suggestion }));
                  setCitySuggestions([]); // Close dropdown
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

    {/* State and ZIP Code */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
  <input
    type="text"
    name="state"
    placeholder="State"
    value={address.state}
    className="border p-2 rounded-lg h-full"
    required
  />
  <div className="flex flex-col">
    <input
      type="number"
      name="zip"
      value={address.zip}
      onChange={handlePincodeChange}
      placeholder="Enter Pincode"
      className="border p-2 rounded-lg h-full"
      required
    />
    
  </div>
  
</div>
{errorMessage && (
      <p className="text-red-500 text-sm p-2 ml-64  h-full">
        {errorMessage}
      </p>
    )}




    <button className="bg-green-600 text-white py-2 px-4 rounded-lg w-[300px]"  >
      Add New Address
    </button>
  </form>
)}


      {showAllAddresses && (
        <div className="mt-4">
          {user?.address?.length > 0 ? (
            user?.address.map((addr, index) => (
              <div key={index} className="p-4 mb-4 border rounded-lg bg-gray-100">
                <p className="text-gray-700">
                {addr?.name}, {addr?.mobileNo}, <br />
                  {addr?.street}, {addr?.city}, <br />
                  {addr?.state} - <strong>{addr?.zip}</strong>
                </p>
                <div className="flex items-center">
                <button
                  className=" text-green-500 hover:text-green-700"
                  onClick={() => handleSelectAddress(addr)}
                >
                  Select
                </button>
                <div
                            className=" text-red-500 cursor-pointer p-2 hover:text-white hover:bg-red-600 hover:rounded-full"
                            onClick={() => deleteAddress(addr._id, user._id)}
                          >
                            <MdDelete fontSize={18} />
                          </div>
                </div>
                
              </div>
            ))
          ) : (
            <p className="text-red-500">No addresses available.</p>
          )}
        </div>
      )}
              

      
      </div>
    {/* Payment Section */}
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Payment</h3>
      <button
        className="bg-green-600 text-white py-2 px-4 rounded-lg w-[300px]"
        onClick={() => handlePayment(selectedAddress)}      >
        Proceed to Payment
      </button>
    </div>
  </div>

  {/*** Right Column - My Cart Summary ***/}
  <div className="w-full lg:w-[30%] bg-white border border-gray-200 rounded-lg shadow-lg">
  <div className="p-6">
    <div className="flex justify-between mb-4">
      <h3 className="text-xl font-semibold text-gray-800">My Cart</h3>
      <span className="text-gray-600">{totalQty} items</span>
    </div>

    <div className="mb-4">
      {loading ? (
<Loader></Loader>      ) : (
        data.map((product) => {
  // Ensure productId exists before accessing its properties
  if (!product.productId) {
    return null; // Skip rendering this product if productId is null
  }


  // Check if product is out of stock (based on available stock)
  const isOutOfStock = product.productId.quantity === 0;
  const isPartialStock = product.productId.quantity < product.quantity;
        
          return (
            <div
              key={product._id}
              className={`flex justify-between mb-4 p-3 border-b border-gray-200 ${isOutOfStock || isPartialStock ? 'opacity-50' : ''}`}
            >
              {/* Product Image and Quantity */}
              <div className="flex flex-col items-center w-24">
                <div className="w-16 h-16 bg-white flex items-center justify-center border-gray-300 rounded-lg overflow-hidden">
                  <div className="relative">
                    <div className={`max-w-full max-h-full object-contain ${isOutOfStock ? 'grayscale' : ''}`}>
                      <img
                        src={product.productId.productImage[0]}
                        alt={product.productId.productName}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
        
                    {/* Show out-of-stock or partial stock warning */}
                    {isOutOfStock && (
                      <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-center font-bold py-1">
                        Out of Stock
                      </div>
                    )}
        
                    {isPartialStock && !isOutOfStock && (
                      <div className="absolute top-0 left-0 w-full bg-yellow-600 text-white text-center font-bold py-1">
                        Only {product.productId.quantity} left
                      </div>
                    )}
                  </div>
                </div>
        
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-5 h-5 flex justify-center items-center rounded-full"
                    onClick={() => decreaseQty(product?._id, product?.quantity, product.productId._id)}
                    disabled={isOutOfStock} // Disable button if out of stock
                  >
                    -
                  </button>
                  <span className="text-gray-700">{product?.quantity}</span>
                  <button
                    className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white w-5 h-5 flex justify-center items-center rounded-full"
                    onClick={() => increaseQty(product?._id, product?.quantity, product.productId._id)}
                    disabled={isOutOfStock || isPartialStock} // Disable button if out of stock or insufficient stock
                  >
                    +
                  </button>
                </div>
              </div>
        
              {/* Product Details and Delete Button */}
              <div className="flex flex-col flex-1 ml-4">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-800">
                    {product.productId.productName}
                  </p>
                  <p className="text-sm font-semibold text-gray-500 line-through">
                    {displayINRCurrency(product.quantity * product.productId.price)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {displayINRCurrency(product.quantity * product.productId.sellingPrice)}
                  </p>
                </div>
                {/* Delete Button */}
                <div className="flex justify-end mt-2">
                  <div
                    className="text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-full cursor-pointer"
                    onClick={() => deleteCartProduct(product?._id)}
                  >
                    <MdDelete />
                  </div>
                </div>
              </div>
            </div>
          );
        })
        
      )}
    </div>

    {/* Cart Summary */}
    <div className="border-t pt-4">
  <div className="flex items-center mb-4 p-2 bg-yellow-100 text-yellow-700 border border-yellow-500 rounded">
    <svg className="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.31 0-6 2.69-6 6h12c0-3.31-2.69-6-6-6z"></path>
    </svg>
    <span className="text-sm font-medium">This delivery is available in Pune Location Only</span>
  </div>

  <div className="flex flex-col">
  <div className="flex justify-between mb-2 text-gray-700">
    <span>Delivery Charges:</span>
    {/* <span>₹{totalPrice < 500 ? 40 : 0}</span> */}
  </div>
  <div className="flex justify-between mb-2 text-red-500">
    <span>Discount:</span>
    {displayINRCurrency(0)}
  </div>
  <div className="flex justify-between font-semibold text-gray-800">
    <span>Total:</span>
    <span className="text-md">
      {displayINRCurrency(totalPrice)}
    </span>
  </div>
</div>

</div>



  </div>
</div>

</div>

  );
};

export default Cart;