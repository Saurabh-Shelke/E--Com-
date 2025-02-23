import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from '../../common';
import { toast } from 'react-toastify';


import PhoneInput from 'react-phone-input-2'; // Assuming you're using react-phone-input-2
import { Slide } from "react-toastify";

const SellerLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    gstin: "",
    password: "", // Include password in initial state
  });

  const navigate = useNavigate(); // For programmatic navigation

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email: formData.email,
      password: formData.password,
      gstin: formData.gstin,
  };    console.log(SummaryApi.sellerSignIn.url)
    try {
      const response = await fetch(SummaryApi.sellerSignIn.url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload), // Convert the payload to a JSON string

      });
  
      const data = await response.json(); // Parse the JSON if response is OK

      if (response.ok) {
        toast.success(data.message); // Show success message

            // Store the token in localStorage
          if (data.sellerToken) {
              localStorage.setItem('sellerToken', data.sellerToken);
              console.log("Seller token saved:", data.sellerToken);
          } else {
              console.warn("No seller token found in response.");
          }
          navigate("/sellerdashboard")
      
          // Redirect to seller dashboard or take further actions
      }
      // Handle success...
  } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
  }
  };

  return (
    <div className="h-full flex items-center justify-center ">
      <div className="flex flex-col w-2/5 p-9 ">
        <h2 className="text-2xl font-bold mb-6 text-sky-900">Login as a Seller</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Phone Input */}
        

          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="input w-full transition duration-300 ease-in-out p-2 border-2 rounded-lg border-gray-400 mb-5 mt-5"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input w-full transition duration-300 ease-in-out p-2 border-2 rounded-lg border-gray-400 mb-5 mt-5"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          
          <p className="text-sm mt-2 text-gray-600">
            We require GSTIN for tax compliance as per government norms.
          </p>

          {/* Terms and Privacy */}
          <p className="text-sm mt-4">
            By continuing, I agree to YMLMart’s{" "}
            <a href="#" className="text-blue-600 underline">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 underline">
              Privacy Policy
            </a>.
          </p>

          {/* Submit Button */}
          <div className="flex justify-between mt-6">
            <button type="submit" className="py-2 px-4 bg-sky-700 rounded-full text-white">
              Login →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerLogin;
