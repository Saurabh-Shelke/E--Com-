// Login.js
import React, { useContext, useState } from 'react';
import loginIcons from '../assest/loginProfile1.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { useUser } from '../context/userContext';
import Context from "../context/index";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: '', password: '' });
  const { saveAuthToken } = useContext(Context);
  const { fetchUserDetails } = useUser(); // Use UserContext
  const { authToken } = useContext(Context); // Get the authToken from Context

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (result.success) {
        toast.success(result.message);
  
        const token = result.data;
  
        if (token) {
          saveAuthToken(token); // Save the token to context and localStorage
          await fetchUserDetails(token); // Fetch user details
  
          // Merge guest cart with user's cart
          const mergeGuestCart = async () => {
            const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
            if (guestCart.length > 0 && token) {
              const response = await fetch(SummaryApi.mergeCart.url, {
                method: SummaryApi.mergeCart.method,
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ cart: guestCart }),
              });
              // Clear localStorage after merging
              localStorage.removeItem("guestCart");
            }
          };
  
          await mergeGuestCart(); // Call the function to merge the cart
  
          navigate('/'); // Redirect to home page
        } else {
          toast.error('Token is undefined.');
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('An error occurred during login.');
    }
  };
  


  return (
    <section id='login'>
      <div className='mx-auto container p-4'>
        <div className='bg-white p-5 w-full max-w-sm mx-auto'>
          <div className='w-20 h-20 mx-auto'>
            <img src={loginIcons} alt='login icons' />
          </div>
          <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className='grid'>
              <label>Email: </label>
              <div className='bg-slate-100 p-2'>
                <input
                  type='email'
                  placeholder='enter email'
                  name='email'
                  value={data.email}
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent'
                />
              </div>
            </div>
            <div>
              <label>Password: </label>
              <div className='bg-slate-100 p-2 flex'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='enter password'
                  value={data.password}
                  name='password'
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent'
                />
                <div
                  className='cursor-pointer text-xl'
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              <Link
                to='/forgot-password'
                className='block w-fit ml-auto hover:underline hover:text-sky-600'
              >
                Forgot password?
              </Link>
            </div>
            <button className='bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>
              Login
            </button>
          </form>
          <p className='my-5'>
            Don't have an account?{' '}
            <Link to='/sign-up' className='text-sky-600 hover:text-sky-700 hover:underline'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
