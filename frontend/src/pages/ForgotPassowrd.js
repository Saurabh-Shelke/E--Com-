import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SummaryApi from "../common";


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(SummaryApi.forgetpassword.url, {
        method: SummaryApi.forgetpassword.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });
    
      // Parse JSON response
      const data = await response.json();
    
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message || 'An error occurred');
      }
    } catch (error) {
      setMessage('An error occurred while processing your request');
    }
  };

  return (
    <section id="forgot-password">
      <div className="mx-auto container p-4">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
          <form className="pt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid">
              <label className="font-medium">Email: </label>
              <div className="bg-slate-100 p-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-full outline-none bg-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="font-medium">New Password: </label>
              <div className="bg-slate-100 p-2">
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-full outline-none bg-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="font-medium">Confirm Password: </label>
              <div className="bg-slate-100 p-2">
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-full outline-none bg-transparent"
                  required
                />
              </div>
            </div>
            <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6">
              Submit
            </button>
          </form>
          {message && <p className="text-center text-gray-600 mt-4">{message}</p>}
          <Link
            to="/login"
            className="block w-fit ml-auto hover:underline hover:text-sky-600 text-center mt-6"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
};



export default ForgotPassword;
