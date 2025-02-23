import React, { useState } from "react";

const UserInfoScreen = ({ onCompleteProfile }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const handleSubmit = () => {
    // Handle the form submission logic here
    const userInfo = {
      firstName,
      lastName,
      gender,
      email,
      dateOfBirth,
    };
    onCompleteProfile(userInfo); // Pass the collected data back
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="w-1/2 bg-white p-10 rounded-lg shadow-lg">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-sm text-gray-600 mb-8">
          Please provide your personal information to finish setting up your account.
        </p>

        {/* First Name Input */}
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-gray-700 text-sm mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        {/* Last Name Input */}
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-gray-700 text-sm mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* Gender Selection */}
        <div className="mb-4">
          <label htmlFor="gender" className="block text-gray-700 text-sm mb-2">
            Gender
          </label>
          <select
            id="gender"
            className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring-blue-500"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="" disabled>Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Date of Birth Input */}
        <div className="mb-4">
          <label htmlFor="dateOfBirth" className="block text-gray-700 text-sm mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring-blue-500"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>

        {/* Continue Button */}
        <button
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
          onClick={handleSubmit}
        >
          Continue
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

export default UserInfoScreen;
