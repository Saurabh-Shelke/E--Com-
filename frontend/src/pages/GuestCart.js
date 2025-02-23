import React, { useContext, useEffect, useState, useMemo } from "react";
import SummaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdCheckCircle, MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import Context from "../context/";
import { useUser } from "../context/userContext"; // Import the useUser hook
import { useCart } from "../context/CartContext";
import { uploadAddress } from "../helpers/uploadAddress";
import axios from "axios";
import Loader from "../components/Loader";

const GuestCart = () => {
  const { authToken } = useContext(Context); // Get the authToken from Context

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser(); // Assuming setUser is available to update user context
  const { updateCartProductCount } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const totalPrice = useMemo(() => {
    return data.reduce(
      (acc, item) => acc + item.quantity * item.productDetails.sellingPrice,
      0
    );
  }, [data]);

  const totalQty = useMemo(() => {
    return data.reduce((acc, item) => acc + item.quantity, 0);
  }, [data]);

  const [hasAddress, setHasAddress] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(user?.address[0]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [streetSuggestions, setStreetSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    try {
      const localCartData = localStorage.getItem("guestCart");
      const cartData = localCartData ? JSON.parse(localCartData) : [];
      console.log(cartData); // Log the correct value here
      setData(cartData);
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
    fetchData(); // Fetch cart data
  }, [user, authToken]);

  useEffect(() => {
    if (!loading && data.length > 0) {
      const validProducts = data.filter(
        (product) =>
          product.productDetails &&
          product.productDetails.quantity > 0 &&
          product.productDetails.quantity >= product.quantity
      );

      const total = validProducts.reduce((previousValue, currentValue) => {
        return (
          previousValue +
          currentValue.quantity * currentValue.productId.sellingPrice
        );
      }, 0);
    }
  }, [data, loading]);

  const increaseQty = (id) => {
    const updatedCart = data.map((item) => {
      if (item.productId === id) {
        // Use productId for matching
        return { ...item, quantity: item.quantity + 1 }; // Update quantity
      }
      return item; // Return unmodified item
    });

    setData(updatedCart); // Update state
    localStorage.setItem("guestCart", JSON.stringify(updatedCart)); // Persist changes
  };

  const  submit = (()=>{
    alert("Please login")
  })

  const decreaseQty = (id) => {
    const updatedCart = data.map((item) => {
      if (item.productId === id && item.quantity > 1) {
        // Ensure quantity > 1
        return { ...item, quantity: item.quantity - 1 };
      }
      return item; // Return unmodified item
    });

    setData(updatedCart); // Update state
    localStorage.setItem("guestCart", JSON.stringify(updatedCart)); // Persist changes
  };

  const deleteCartProduct = (id) => {
    const updatedCart = data.filter((item) => item.productId !== id);
    setData(updatedCart); // Update state
    localStorage.setItem("guestCart", JSON.stringify(updatedCart)); // Persist changes
  };

  useEffect(() => {
    if (!loading && data.length > 0) {
      const total = data.reduce(
        (acc, item) => acc + item.quantity * item.productId.sellingPrice,
        0
      );
      setFinalAmount(total);
    }
  }, [data, loading]);
  useEffect(() => {
    fetchData(); // Initialize cart for guest users
  }, []);

  return (
    <div className="container mx-auto flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
      {/*** Left Column - LOGIN, Delivery Address, Payment ***/}
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
              <p className="text-gray-700">{user?.name}</p>
            </div>
          ) : (
            <p className="text-red-500">Please log in to proceed.</p>
          )}
        </div>

        {/* Delivery Address */}
        <div className="mb-6 p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xl font-semibold text-gray-800">
              Delivery Address
            </h3>
            <MdCheckCircle className="text-green-500 text-xl" />
          </div>
          {selectedAddress ? (
            <div className="text-gray-700 flex gap-10">
              <p>
                {selectedAddress?.name}, {selectedAddress?.mobileNo}, <br />
                {selectedAddress?.street}, {selectedAddress?.city}, <br />
                {selectedAddress?.state},{" "}
                <strong>{selectedAddress?.zip}</strong>
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
              {showAllAddresses ? "Hide Addresses" : "Change Address"}
            </button>

            <IoIosAddCircle className="text-sky-500 text-xl ml-2" />
            <button
              className=" text-sky-600 hover:text-sky-700"
              //                   onClick={handleAddNewAddress}
            >
              {showAddressForm ? "Cancel" : "Add New Address"}
            </button>
          </div>

          {showAddressForm && (
            <form className="grid gap-4 mt-4 max-w-lg ">
              {/* Name and Mobile Number */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  // value={address.name}
                  //onChange={(e) => setAddress((prev) => ({ ...prev, name: e.target.value }))}
                  className="border p-2 rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="mobileNo"
                  placeholder="Mobile Number"
                  // value={address.mobileNo}
                  //onChange={(e) => setAddress((prev) => ({ ...prev, mobileNo: e.target.value }))}
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
                    // value={address.street}
                    className="border p-2 rounded-lg w-full"
                    required
                    //onChange={handleStreetChange}
                  />
                  {streetSuggestions.length > 0 && (
                    <ul className="border border-gray-300 p-2 rounded-lg bg-white">
                      {streetSuggestions.map((suggestion, idx) => (
                        <li
                          key={idx}
                          className="p-1 hover:bg-gray-100 cursor-pointer"
                          //onClick={() => {
                          //setAddress((prev) => ({ ...prev, street: suggestion }));
                          //setStreetSuggestions([]); // Close dropdown
                          //}}
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
                    //value={address.city}
                    //onChange={handleCityChange}
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
                          // onClick={() => {
                          //   setAddress((prev) => ({ ...prev, city: suggestion }));
                          //   setCitySuggestions([]); // Close dropdown
                          // }}
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
                  // value={address.state}
                  className="border p-2 rounded-lg h-full"
                  required
                />
                <div className="flex flex-col">
                  <input
                    type="number"
                    name="zip"
                    // value={address.zip}
                    // onChange={handlePincodeChange}
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

              <button className="bg-green-600 text-white py-2 px-4 rounded-lg w-[300px]">
                Add New Address
              </button>
            </form>
          )}

          {/* {showAllAddresses && (
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
                            // onClick={() => handleSelectAddress(addr)}
                          >
                            Select
                          </button>
                          <div
                                      className=" text-red-500 cursor-pointer p-2 hover:text-white hover:bg-red-600 hover:rounded-full"
                                      // onClick={() => deleteAddress(addr._id, user._id)}
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
                )} */}
        </div>
        {/* Payment Section */}
        <div className="p-6">  
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Payment</h3>
          <button className="bg-green-600 text-white py-2 px-4 rounded-lg w-[300px]"               onClick={() => submit()}
          >
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
              <Loader></Loader>
            ) : (
              data.map((product) => {
                // Ensure productId exists before accessing its properties
                if (!product.productDetails) {
                  return null; // Skip rendering this product if productId is null
                }

                // Check if product is out of stock (based on available stock)
                const isOutOfStock = product.productDetails.quantity === 0;
                const isPartialStock =
                  product.productDetails.quantity > 0 &&
                  product.productDetails.quantity < product.quantity;
                return (
                  <div
  key={product.productId}
  className={`flex justify-between mb-4 p-3 border-b border-gray-200 ${
    isOutOfStock || isPartialStock ? 'opacity-50' : ''
  }`}
>

                    {/* Product Image and Quantity */}
                    <div className="flex flex-col items-center w-24">
                      <div className="w-16 h-16 bg-white flex items-center justify-center border-gray-300 rounded-lg overflow-hidden">
                        <div className="relative">
                          <div
                            className={`max-w-full max-h-full object-contain ${
                              isOutOfStock ? "grayscale" : ""
                            }`}
                          >
                            <img
                              src={product.productDetails.productImage[0]}
                              alt={product.productDetails.productName}
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
                              Only {product.productDetails.quantity} left
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
  <button
    className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-5 h-5 flex justify-center items-center rounded-full"
    onClick={() => decreaseQty(product.productId)}
    disabled={isOutOfStock || (isPartialStock && product.productDetails.quantity <= product.quantity)}
  >
    -
  </button>
  <span className="text-gray-700">{product.quantity}</span>
  <button
    className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white w-5 h-5 flex justify-center items-center rounded-full"
    onClick={() => increaseQty(product.productId)}
    disabled={isOutOfStock || (isPartialStock && product.productDetails.quantity <= product.quantity)}
  >
    +
  </button>
</div>

                    </div>

                    {/* Product Details and Delete Button */}
                    <div className="flex flex-col flex-1 ml-4">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-800">
                          {product.productDetails.productName}
                        </p>
                        <p className="text-sm font-semibold text-gray-500 line-through">
                          {displayINRCurrency(
                            product.quantity * product.productDetails.price
                          )}
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {displayINRCurrency(
                            product.quantity *
                              product.productDetails.sellingPrice
                          )}
                        </p>
                      </div>
                      {/* Delete Button */}
                      <div className="flex justify-end mt-2">
                        <div
                          className="text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-full cursor-pointer"
                          onClick={() =>
                            deleteCartProduct(product.productId)
                          }
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
              <svg
                className="w-6 h-6 text-yellow-500 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.31 0-6 2.69-6 6h12c0-3.31-2.69-6-6-6z"
                ></path>
              </svg>
              <span className="text-sm font-medium">
                This delivery is available in Pune Location Only
              </span>
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

export default GuestCart;
