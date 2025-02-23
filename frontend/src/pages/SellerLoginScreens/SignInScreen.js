import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FaRegCheckCircle } from "react-icons/fa";
import axios from "axios";
import SummaryApi from '../../common';
import { toast } from 'react-toastify';


const SellerPanel = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [message, setMessage] = useState('');

  const API_KEY = 'bf841ec7-9f64-11ef-8b17-0200cd936042';

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    gstin: "",
    password: "",
    // confirmPassword: "",
    fullName: "",
    displayName: "",
    // idProof: null,
  });
  const navigate = useNavigate();


  const sendOtp = async () => {
    // if (!mobileNumber || mobileNumber.length !== 10) {
    //   setMessage('Please enter a valid 10-digit mobile number.');
    //   return;
    // }

    try {
      const response = await fetch(`https://2factor.in/API/V1/${API_KEY}/SMS/${mobileNumber}/AUTOGEN2/OTP1`, {
        method: 'GET',
      });

      const data = await response.json();

      if (data.Status === 'Success') {
        setSessionId(data.Details);  // Store the session ID to use for OTP verification
        setMessage('OTP sent successfully via SMS.');
      } else {
        setMessage('Failed to send OTP. Try again later.');
      }
    } catch (error) {
      setMessage('Error sending OTP.');
    }
  };

  // Function to verify OTP
  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      const response = await fetch(`https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (data.Status === 'Success') {
        setMessage('OTP verified successfully.');
      } else {
        setMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setMessage('Error verifying OTP.');
    }
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, idProof: e.target.files[0] });
  };

  const handleSubmit = async () => {
    // Check if password and confirm password match
    // if (formData.password !== formData.confirmPassword) {
    //     alert("Passwords do not match.");
    //     return;
    // }

    // Prepare the data as JSON
    const payload = {
        mobile: formData.mobile,
        email: formData.email,
        gstin: formData.gstin,
        password: formData.password,
        fullName: formData.fullName,
        displayName: formData.displayName,
    };

    try {
        const response = await fetch(SummaryApi.sellerSignUP.url, {
            method: SummaryApi.signUP.method,
            headers: {
                'Content-Type': 'application/json', // Set content type to JSON
            },
            body: JSON.stringify(payload), // Convert the payload to JSON
        });

        const dataApi = await response.json();
        console.log(dataApi.message);

        if (dataApi.success) {
            toast.success(dataApi.message);
            navigate("/sellerlogin")

        } else if (dataApi.error) {
            toast.error(dataApi.message);
        }

        nextStep(); // Move to the next step after successful registration
    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred during registration. Please try again.");
    }
};
  

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const getImageForStep = () => {
    switch (step) {
      case 1:
        return "image1.png";
      case 2:
        return "image2.png";
      case 3:
        return "image3.png";
      default:
        return "image1.jpg";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col lg:flex-row w-11/12 mx-auto rounded-lg overflow-hidden">
        {/* Left column */}
        <div className="w-full lg:w-1/2 p-8">
          {/* Progress Indicator */}
          <div className="flex justify-between mb-8 text-base font-semibold">
            <span className={`step ${step >= 1 ? "text-blue-900" : "text-gray-400"} flex items-center`}>
              <FaRegCheckCircle className="m-2" /> Email & GST
            </span>
            <span className={`step ${step >= 2 ? "text-blue-900" : "text-gray-400"} flex items-center`}>
              <FaRegCheckCircle className="m-2" /> Password Creation
            </span>
            <span className={`step ${step === 3 ? "text-blue-900" : "text-gray-400"} flex items-center`}>
              <FaRegCheckCircle className="m-2" /> Onboarding Dashboard
            </span>
          </div>

          {/* Step 1: Mobile, Email, GSTIN */}
     {/* Step 1: Mobile, Email, GSTIN */}
          {step === 1 && (
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold mb-6 text-sky-900">Step 1: Seller Information</h2>
              <div className="otp-login">
                <h2>OTP Login</h2>
                <div>
                  <label>Mobile Number:</label>
                  <PhoneInput
                    country={'in'}
                    value={mobileNumber}
                    onChange={(value) => setMobileNumber(value)}
                    inputClass="input transition duration-300 ease-in-out p-2 border-2 rounded-lg border-gray-400 mb-5"
                    placeholder="Enter mobile number"
                  />
                  <button
                    onClick={sendOtp}
                    className="btn-blue mt-3"
                  >
                    Send OTP
                  </button>
                </div>

                {sessionId && (
                  <div>
                    <label>OTP:</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="input transition duration-300 ease-in-out p-2 border-2 rounded-lg border-gray-400 mb-5"
                    />
                    <button
                      onClick={verifyOtp}
                      className="btn-blue mt-3"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}

                {message && <p>{message}</p>}
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="input transition duration-300 ease-in-out p-2 border-2 rounded-lg border-gray-400 mb-5"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="gstin"
                placeholder="GSTIN"
                className="input transition duration-300 ease-in-out p-2 border-2 rounded-lg border-gray-400"
                value={formData.gstin}
                onChange={handleInputChange}
                required
              />
              <p className="text-sm mt-2 text-gray-600">
                We require GSTIN for tax compliance as per government norms.
              </p>

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

              <div className="flex justify-between mt-6">
                <button className="btn-blue" onClick={nextStep}>
                  Continue for registration →
                </button>
                <Link to="/sellerlogin">Login →</Link>
              </div>
            </div>
          )}

          {/* Step 2: Password Creation */}
          {step === 2 && (
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold mb-6 text-blue-900">Step 2: Password Creation</h2>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input transition duration-300 ease-in-out p-2 border-2 rounded-lg border-gray-400 mb-5"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              {/* <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="input transition duration-300 ease-in-out p-2 border-2 rounded-lg border-gray-400 mb-5"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              /> */}
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="input transition duration-300 ease-in-out p-2 border-2 rounded-lg border-gray-400 mb-5"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="displayName"
                placeholder="Display Name"
                className="input transition duration-300 ease-in-out p-2 border-2 rounded-lg border-gray-400 mb-5"
                value={formData.displayName}
                onChange={handleInputChange}
                required
              />

              {/* <label className="block mt-4 mb-2 font-semibold text-gray-700">Upload ID Proof</label>
              <input
                type="file"
                name="idProof"
                className="input"
                onChange={handleFileChange}
              /> */}

              <div className="flex justify-between mt-6">
                <button className="btn-gray" onClick={prevStep}>
                  ← Back
                </button>
                <button className="btn-blue" onClick={handleSubmit}>
                  Register →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Cross-check Details */}
          {/* {step === 3 && (
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold mb-6 text-blue-900">Step 3: Details</h2>
              <p className="mb-4 flex items-center justify-between">
                <strong>Mobile:</strong> {formData.mobile}
              </p>
              <p className="mb-4 flex items-center justify-between">
                <strong>Email:</strong> {formData.email}
              </p>
              <p className="mb-4 flex items-center justify-between">
                <strong>GSTIN:</strong> {formData.gstin}
              </p>
              <p className="mb-4 flex items-center justify-between">
                <strong>Full Name:</strong> {formData.fullName}
              </p>
              <p className="mb-4 flex items-center justify-between">
                <strong>Display Name:</strong> {formData.displayName}
              </p>

              <div className="flex justify-between mt-6">
                <button className="btn-gray" onClick={prevStep}>
                  ← Back
                </button>

                <Link to='/seller-panel/all-products' className="btn-blue"
                >Go to Listing Panel</Link>

                <Link to='/' className="btn-blue">Go to Live Page</Link>
              </div>
            </div>
          )} */}
        </div>

        {/* Right column */}
        <div className="w-full lg:w-1/2 bg-gray-200 flex items-center justify-center">
          <img src={getImageForStep()} alt="Illustration" className="object-contain h-full p-8" />
        </div>
      </div>
    </div>
  );
};

export default SellerPanel;
