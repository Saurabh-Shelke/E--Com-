import React, { useState } from "react";

const OtpVerificationScreen = ({ mobileNumber, onChangeNumber, onOtpVerified }) => {
  // Set OTP to 123456 initially
  const [otp, setOtp] = useState("123456");

  const handleVerifyClick = () => {
    if (otp === "123456") {
      onOtpVerified(); // Call the function to move to the next screen
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="w-1/2 bg-white p-10 rounded-lg shadow-lg">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-2">OTP Verification</h1>
        <p className="text-sm text-gray-600 mb-4">
          Enter the OTP sent to your mobile number {mobileNumber}
        </p>

        {/* Change Mobile Number */}
        <button
          onClick={onChangeNumber}
          className="text-blue-500 text-sm underline mb-4"
        >
          Change Number
        </button>

        {/* OTP Input */}
        <div className="mb-4">
          <label htmlFor="otp" className="block text-gray-700 text-sm mb-2">
            Enter 6-digit OTP
          </label>
          <input
            type="text"
            id="otp"
            className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter OTP"
            value={otp}
            readOnly // Makes the input field read-only since the OTP is pre-set
            maxLength="6"
          />
        </div>

        {/* Resend OTP Button */}
        <button className="text-blue-500 text-sm underline mb-6">
          Resend OTP
        </button>

        {/* Verify Button */}
        <button
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
          onClick={handleVerifyClick} // Added onClick handler
        >
          Verify OTP
        </button>

        {/* Privacy Policy */}
        <p className="text-xs text-gray-500 text-center mt-4">
          By continuing, you agree to our{" "}
          <a href="/privacy-policy" className="text-blue-500 underline">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
};

export default OtpVerificationScreen;
