import React, { useState, useEffect,useContext } from "react";
import { FaTimes, FaBars } from "react-icons/fa";
import { BsBagXFill } from "react-icons/bs";
import ProfileIcons from '../assest/loginProfile1.png'
import axios from "axios";
import SummaryApi from "../common/index";
import { toast } from "react-toastify";
import { uploadAddress } from "../helpers/uploadAddress";
import Context from "../context/index";
import { FaTruck, FaBox, FaTimesCircle, FaCheckCircle, FaHourglassHalf, FaMotorcycle } from "react-icons/fa";import { MdLocalShipping, MdCancel } from "react-icons/md";
// import { BsBagXFill } from "react-icons/bs";
import { RiShoppingCartFill } from "react-icons/ri"; 
import { FaStar } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [activeSection, setActiveSection] = useState("Profile Information");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [kycDetails, setKycDetails] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const { authToken } = useContext(Context); // Get the authToken from Context
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Load data from localStorage if available, otherwise fetch from API
    const savedName = localStorage.getItem("userName");
    const savedEmail = localStorage.getItem("userEmail");

    if (savedName && savedEmail) {
      setName(savedName);
      setEmail(savedEmail);
    } else {
      const fetchUserData = async () => {
        try {
          const response = await fetch(SummaryApi.current_user.url, { 
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
          });
          const data = await response.json();
          setUserData(data.data);
          setName(data.data.name);
          setEmail(data.data.email);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [authToken]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Save updated data to state and localStorage
    setUserData((prevData) => ({
      ...prevData,
      name: name,
      email: email,
    }));
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };
  
  const [address, setAddress] = useState({
    name: "", 
    mobileNo: "",
    street: "",
    city: "Pune",  // Default city as Pune
    state: "Maharashtra", // Default state as Maharashtra
    zip: "",
  });
  
  const [streetSuggestions, setStreetSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]); // Not needed, but keeping it if required for other uses
  
  const handleAddNewAddress = () => {
    setShowAddressForm((prevState) => !prevState);
    if (!showAddressForm) {
      setAddress({ 
        name: "", 
        mobileNo: "", 
        street: "", 
        city: "Pune", // Reset city to Pune
        state: "Maharashtra", // Reset state to Maharashtra
        zip: "" 
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (address.state !== "Maharashtra") {
      alert("Please enter an address in Maharashtra");
      return;
    }
    await uploadAddress(address, setUserData, authToken);
    console.log(userData)
    setShowAddressForm(false);
  };
  useEffect(() => {
    if (userData?.address?.length > 0) {
      console.log("Updated addresses:", userData.address);
    }
  }, [userData]);
  
  // Fetch street suggestions from Nominatim for streets in Pune, Maharashtra
  const fetchStreetSuggestions = async (query) => {
    if (query.length < 3) return; // Avoid too many API calls for short queries
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?street=${query}&city=Pune&state=Maharashtra&countrycodes=IN&format=json`
      );
      setStreetSuggestions(response.data.map((item) => item.display_name));
    } catch (error) {
      console.error("Error fetching street suggestions:", error);
    }
  };
  
  // Update street input and fetch suggestions
  const handleStreetChange = (e) => {
    const { value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, street: value }));
    fetchStreetSuggestions(value);
  };

  const fetchKycStatus = async (authToken, userId) => {
    // Replace the :userId in the URL with the actual userId
    const urlWithUserId = SummaryApi.getmykyc.url.replace(':userId', userId);
    try {
      const response = await fetch(urlWithUserId, {
        method: SummaryApi.getmykyc.method,
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      console.log(data)
      setKycDetails(data.data)
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
const handleKYCClick = () => {
    navigate("/businessprofile"); 
  };
const handledelete = ()=>{
  navigate("/request-for-delete-account");
}
  useEffect(() => {
    const fetchUserData = async (authToken) => {
      // const authToken = localStorage.getItem('authToken');
      
      try {
        const response = await fetch(SummaryApi.current_user.url, {
          method: SummaryApi.current_user.method,
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`, 
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setUserData(data.data);
        setOrderData(data.orderDetail);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUserData(authToken);
  }, []);

  const deleteAddress = async (id, userId, authToken) => {
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
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to delete address");
    }
  };


  const StarRating = ({ itemId, initialRating, onSave }) => {
    const [rating, setRating] = useState(initialRating || 0);
  
    const handleClick = (newRating) => {
      setRating(newRating);
      onSave(itemId, newRating); // Trigger the save callback
    };
  
    return (
      <div className="flex items-center space-x-1"> {/* Flex container to align stars horizontally */}
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`cursor-pointer ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}
            onClick={() => handleClick(index + 1)}
          />
        ))}
      </div>
    );
  };
  
  
  const [ratedItems, setRatedItems] = useState({});

  // Fetch rated items from localStorage on initial load
  useEffect(() => {
    const savedRatings = localStorage.getItem('ratedItems');
    if (savedRatings) {
      setRatedItems(JSON.parse(savedRatings));
    }
  }, []);

  const handleSaveRating = async (itemId, rating) => {
    try {
       const response = await fetch(SummaryApi.saveRating.url, {
         method: SummaryApi.saveRating.method,
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ itemId, rating }),
       });
       if (!response.ok) {
         throw new Error('Failed to save rating');
       }
 
       const result = await response.json();
       if (result.success) {
         const updatedRatedItems = { ...ratedItems, [itemId]: true };
         setRatedItems(updatedRatedItems);
         localStorage.setItem('ratedItems', JSON.stringify(updatedRatedItems)); // Save to localStorage
         toast.success('Thanks for rating!', {
           position: 'top-right',
           autoClose: 3000,
           theme: 'colored',
         });
       } else {
         throw new Error(result.message || 'Failed to save rating');
       }
     } catch (error) {
       console.error('Error saving rating:', error);
       toast.error('Error saving rating. Please try again.');
     }
   };
 
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

    // Function to return the appropriate icon for each delivery status
    const getStatusIcon = (status) => {
      
      switch (status.toLowerCase()) {
        case "ordered":
          return <RiShoppingCartFill className="text-yellow-600" />;
        case "shipped":
          return <FaTruck className="text-blue-600" />;
        case "in-transit":
          return <MdLocalShipping className="text-orange-500" />;
        case "delivered":
          return <FaCheckCircle className="text-green-600" />;
        case "cancelled":
          return <FaTimesCircle className="text-red-600" />;
        case "processing":
          return <FaHourglassHalf className="text-purple-600" />;  // Add a processing icon
          case "out of delivery": // Make sure it's lowercase
          return <FaMotorcycle className="text-indigo-600" />;  // Add out-for-delivery icon
        default:
          return <FaBox className="text-gray-500" />;

      }
    };
  
  const renderContent = () => {
    switch (activeSection) {
      case "Profile Information":
        return (
          <div>
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold mb-4">Profile Information</h1>
            </div>
            <div className="flex flex-col items-center mb-6">
              <div className="relative inline-block">
                <img
                  src={ProfileIcons}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mb-2"
                />
              </div>
              <h2 className="text-xl font-semibold">{name.toUpperCase()}</h2>
            </div>
            <form className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="name" className="font-semibold mb-1">
                  Name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 p-2 rounded"
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email" className="font-semibold mb-1">
                  Email
                </label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 p-2 rounded"
                  disabled={!isEditing}
                />
              </div>

              <div className="flex flex-row gap-2">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="bg-sky-600 text-white py-2 px-4 rounded mt-4 w-full"
                >
                  Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveClick}
                  className="bg-green-600 text-white py-2 px-4 rounded mt-4 w-full"
                >
                  Save
                </button>
              )}
              <button onClick={handledelete} className="bg-sky-600 text-white py-2 px-4 rounded mt-4 w-full">Delete Ac</button>
              </div>
            </form>
          </div>
        );
        
        case "My Orders":
          return (
            <div>
              <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        
              {orderData ? ( 
    <div className="w-full max-w-3xl">
        {orderData.length > 0 ? (
            <div>
                <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                {orderData
                    .filter(order => order.status !== 'created') // Filter out orders with status 'created'
                    .map((order) => (
                        <div key={order._id} className="mb-6 relative">
                            <div className="order-container p-6 border border-gray-300 rounded-lg bg-white shadow-lg relative">
                                {order.products.map((product) => (
                                    <div
                                        key={product._id}
                                        className="w-full h-32 my-3 p-3 border border-gray-200 rounded-lg flex items-center bg-sky-50 shadow-sm"
                                    >
                                        <div className="h-24 w-24 overflow-hidden rounded-lg shadow-md">
                                            <img
                                                src={product.image[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-4 flex flex-col justify-between">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                <a href={`/product/${product.productId}`}>{product.name}</a>
                                            </h3>
                                            <h4 className="text-sm text-gray-600">
                                                {product.category}
                                            </h4>
                                            <p className="text-sm text-gray-700">
                                                <strong>Quantity:</strong> {product.quantity}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <strong>Total Cost:</strong>{" "}
                                                <span className="font-bold text-gray-800">
                                                    {"₹" + product.price * product.quantity}
                                                </span>
                                            </p>
                                            <p className="text-sm flex items-center">
                                                <strong>Status:</strong>{" "}
                                                <span className="text-green-700 font-semibold flex items-center">
                                                    <span className="ml-2">{order.status}</span>
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Order ID and Tracking Status */}
                                <div className="absolute bottom-0 right-0 p-4 bg-white rounded-lg shadow-lg">
                                    <p className="text-sm text-blue-600 font-semibold flex items-center">
                                        {getStatusIcon(order.deliveryStatus)}
                                        {order.status === 'created' ? (          
                                            <span className="ml-2">Tracking Status: Order Failed</span>
                                        ) : (
                                            <span className="ml-2"> Tracking Status: {order.deliveryStatus}</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        ) : (
            <div className="flex flex-col items-center">
                <BsBagXFill style={{ fontSize: "6rem" }} className="text-sky-600 text-6xl mb-2" />
                <p>No orders found!</p>
            </div>
        )}
    </div>
) : (
    <div className="flex flex-col items-center">
        <BsBagXFill style={{ fontSize: "6rem" }} className="text-sky-600 text-6xl mb-2" />
        <p>No order found!</p>
    </div>
)}

            </div>
          );




          case "Address":
            return (
              <div>
                <h1 className="text-2xl font-bold mb-4">Address</h1>
          
                {/* Add New Address Button */}
                <div className="flex items-center mt-4">
                  <IoIosAddCircle className="text-sky-500 text-xl" />
                  <button
                    className="ml-2 text-blue-500 hover:text-blue-700"
                    onClick={handleAddNewAddress}
                  >
                    {showAddressForm ? "Cancel" : "Add New Address"}
                  </button>
                </div>
          
                {/* Address Form */}
                {showAddressForm && (
                  <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
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
          
                    {/* Street Input with Suggestions */}
                    <input
                      type="text"
                      name="street"
                      placeholder="Street"
                      value={address.street}
                      onChange={handleStreetChange}
                      className="border p-2 rounded-lg"
                      required
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
          
                    {/* City and State (Read-Only) */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        readOnly
                        className="border p-2 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                      <input
                        type="text"
                        name="state"
                        value={address.state}
                        readOnly
                        className="border p-2 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
          
                    {/* ZIP Code Input */}
                    
                <select
                  name="zip"
                  value={address.zip}
                  onChange={(e) => setAddress((prev) => ({ ...prev, zip: e.target.value }))}
                  className="border p-2 rounded-lg w-full"
                  required
                >
                  <option value="" disabled>Select Pincode</option>
                  <option value="411057">411057</option>
                  <option value="411033">411033</option>
                  <option value="411028">411028</option>
                  <option value="411013">411013</option>
                  <option value="410506">410506</option>
                  <option value="412303">412303</option>
                  <option value="412108">412108</option>
                  <option value="411014">411014</option>
                  <option value="411009">411009</option>
                  <option value="411001">411001</option>

                  
                  {/* Add more options as needed */}
                </select>

          
                    <button className="bg-green-600 text-white py-2 px-4 rounded-lg w-full">
                      Add New Address
                    </button>
                  </form>
                )}
          
                {/* Display Existing Addresses */}
                <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {userData?.address?.length > 0 ? (
                    userData.address.map((addr, index) => (
                      <div
                        key={index}
                        className="relative p-6 bg-white shadow-md rounded-lg border border-gray-300 mb-4"
                      >
                        <div className="flex justify-between">
                          <strong className="text-gray-800">{addr.name}</strong>
                          <div
                            className="absolute top-2 right-2 text-red-500 cursor-pointer p-2 hover:text-white hover:bg-red-600 hover:rounded-full"
                            onClick={() => deleteAddress(addr._id, userData._id)}
                          >
                            <MdDelete fontSize={18} />
                          </div>
                        </div>
          
                        <p className="text-gray-800 mt-4">
                          <span>{addr.mobileNo}</span>
                        </p>
                        <p className="text-gray-700 mt-2">
                          {addr.street}, {addr.city}, <br />
                          {addr.state} - <strong>{addr.zip}</strong>
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center items-center p-2">
                      <p className="text-red-500 text-md">No addresses provided.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          





         // Inside renderContent function
       case "Delivered":
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Delivered Items</h1>
            {orderData ? (
              <div className="w-full max-w-3xl">
                {orderData.filter((order) => order.deliveryStatus.toLowerCase() === "delivered").length > 0 ? (
                  orderData
                    .filter((order) => order.deliveryStatus.toLowerCase() === "delivered")
                    .map((order) => (
                      <div key={order._id} className="mb-6 relative">
                        <div className="order-container p-6 border border-gray-300 rounded-lg bg-white shadow-lg relative">
                          {order.products.map((product) => (
                            <div
                              key={product._id}
                              className="w-full h-32 my-3 p-3 border border-gray-200 rounded-lg flex items-center bg-sky-50 shadow-sm relative"
                            >
                              <div className="h-24 w-24 overflow-hidden rounded-lg shadow-md">
                                <img
                                  src={product.image[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="ml-4 flex flex-col justify-between flex-1">
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-700">
                                  <strong>Total Cost:</strong>{" "}
                                  <span className="font-bold text-gray-800">
                                    {"₹" + product.price * product.quantity}
                                  </span>
                                </p>
                                <p className="text-sm text-gray-700">
                                  <strong>Delivered On:</strong>{" "}
                                  {new Date(order.deliveredDate).toLocaleString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              {/* Star Rating Section */}
                              <div className="absolute top-0 right-0 mt-4 mr-4">
                                <div className="flex items-center space-x-1">
                                  <span className="text-sm text-gray-700 mr-2">Your Rating:</span>
                                  {!ratedItems[product._id] ? (
                                    <StarRating
                                      itemId={product._id}
                                      initialRating={product.rating}
                                      onSave={handleSaveRating}
                                    />
                                  ) : (
                                    <div className="text-green-500">Thanks for rating!</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center">
                    <BsBagXFill style={{ fontSize: "6rem" }} className="text-sky-600 text-6xl mb-2" />
                    <p>No delivered items found!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <BsBagXFill style={{ fontSize: "6rem" }} className="text-sky-600 text-6xl mb-2" />
                <p>No delivered items found!</p>
              </div>
            )}
          </div>
        );
      
      case "My KYC Status":
        const statusColors = {
          Rejected: "text-red-500 bg-red-100 border-red-500",
          Pending: "text-yellow-500 bg-yellow-100 border-yellow-500",
          Verified: "text-green-500 bg-green-100 border-green-500",
          undefined: "text-blue-500 bg-blue-100 border-blue-500", // Default when status is undefined
        };
        if (!kycDetails) {
          return (
            <div>
              <h1 className="text-2xl font-bold mb-4">My KYC Status</h1>
              <div className="flex flex-col items-center">
              <p className="pb-5 font-semibold">Your KYC is pending!</p>
              <button onClick={handleKYCClick} className=" flex items-center justify-center bg-blue-600 text-white py-3 px-10 font-semibold rounded-xl" >KYC</button>
              </div>
            </div>
          );
        }
        return (
          <div>
    <h1 className="text-2xl font-bold mb-4">My KYC Status</h1>
      <div className="flex flex-col items-center">
        <p className="text-xl font-semibold px-4 py-2">Your Kyc status is</p>
        <div
          className={` font-semibold px-2 py-1 rounded border ${statusColors[kycDetails.kycStatus] || "text-gray-500 bg-gray-100 border-gray-500"}`}
        >
          {kycDetails.kycStatus ? kycDetails.kycStatus : "Complete KYC Now"}
        </div>
        {kycDetails.kycStatus === undefined && (
          <button
            className="mt-4 px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition duration-300"
          >
            Complete KYC Now
          </button>
        )}
      </div>
          </div>
        );
      default:
        return (
          <div>
            <h1 className="text-2xl font-bold mb-4">Profile Information</h1>
          </div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center mt-40 bg-gray-100">
      <div className="relative flex w-full max-w-5xl  bg-white rounded-lg shadow-lg">
        <button
          className="absolute top-4 right-4 bg-sky-600 text-white p-2 rounded-md md:hidden"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        <aside
          className={`z-50 md:z-10 md:h-auto fixed top-0 left-0 mt[0] h-[100vh] bg-gray-100 p-4 transition-transform transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 md:w-64`}
        >
          <ul className="space-y-5">
            <li
              className={
                activeSection === "Profile Information"
                  ? "font-bold text-sky-600"
                  : ""
              }
            >
              <button
                onClick={() => {
                  setActiveSection("Profile Information");
                  toggleSidebar();
                }}
                className="text-lg"
              >
                Profile Information
              </button>
            </li>
            <li
              className={
                activeSection === "My Orders" ? "font-bold text-sky-600" : ""
              }
            >
              <button
                onClick={() => {
                  setActiveSection("My Orders");
                  toggleSidebar();
                }}
                className="text-lg"
              >
                My Orders
              </button>
            </li>
            <li
              className={
                activeSection === "Address" ? "font-bold text-sky-600" : ""
              }
            >
              <button
                onClick={() => {
                  setActiveSection("Address");
                  toggleSidebar();
                }}
                className="text-lg"
              >
                Address
              </button>
            </li>
            <li className={activeSection === "Delivered" ? "font-bold text-sky-600" : ""}>
    <button
      onClick={() => {
        setActiveSection("Delivered");
        toggleSidebar();
      }}
      className="text-lg"
    >
      Delivered
    </button>
    
  </li>

  <li className={activeSection === "My KYC Status" ? "font-bold text-sky-600" : ""}>

  <button
      onClick={() => {
        setActiveSection("My KYC Status");
        toggleSidebar();
        fetchKycStatus(authToken,userData._id)

      }}
      className="text-lg"
    >
      My KYC Status
    </button>
    </li>
            
            {/* <li
              className={
                activeSection === "Track Order" ? "font-bold text-sky-600" : ""
              }
            >
              <button
                onClick={() => {
                  setActiveSection("Track Order");
                  toggleSidebar();
                }}
                className="text-lg"
              >
                Track Order
              </button>
            </li> */}
          </ul>
        </aside>
        <main className="flex-1 p-4 ">{renderContent()}</main>
      </div>

    </div>
    



  );

};

export default Profile;