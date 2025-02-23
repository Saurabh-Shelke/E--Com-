import React, { useState } from 'react';
import loginIcons from '../assest/signin.gif';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import profile from "../assest/loginProfile1.png";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    refferredbycode: "",
    confirmPassword: "",
    mobileNo: "",
    profilePic: ""
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!data.mobileNo) {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!/^\d{10}$/.test(data.mobileNo)) {
      newErrors.mobileNo = "Enter a valid 10-digit mobile number";
    }
    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (!data.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('name', data.name);
    formData.append('refferredbycode', data.refferredbycode);
    formData.append('mobileNo', data.mobileNo);

    const dataResponse = await fetch(SummaryApi.signUP.url, {
      method: SummaryApi.signUP.method,
      body: formData
    });

    const dataApi = await dataResponse.json();
    if (dataApi.success) {
      toast.success(dataApi.message);
      navigate("/login");
    } else {
      toast.error(dataApi.message);
    }
  };

  return (
    <section id='signup'>
      <div className='mx-auto container p-4'>
        <div className='bg-white p-5 w-full max-w-sm mx-auto'>
          <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
            <div>
              <img src={profile} alt='login icons' />
            </div>
          </div>

          <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className='grid'>
              <label>Name :</label>
              <div className={`bg-slate-100 p-2 ${errors.name ? 'border border-red-500' : ''}`}>
                <input
                  type='text'
                  placeholder='Enter Your Name'
                  name='name'
                  value={data.name}
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent' />
              </div>
              {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
            </div>

            <div className='grid'>
              <label>Email :</label>
              <div className={`bg-slate-100 p-2 ${errors.email ? 'border border-red-500' : ''}`}>
                <input
                  type='email'
                  placeholder='Enter Email'
                  name='email'
                  value={data.email}
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent' />
              </div>
              {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
            </div>

            <div className='grid'>
              <label>Mobile No :</label>
              <div className={`bg-slate-100 p-2 ${errors.mobileNo ? 'border border-red-500' : ''}`}>
                <input
                  type='number'
                  placeholder='Enter Mobile No'
                  name='mobileNo'
                  value={data.mobileNo}
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent' />
              </div>
              {errors.mobileNo && <p className='text-red-500 text-sm'>{errors.mobileNo}</p>}
            </div>

            <div className='grid'>
              <label>Refferal Code :</label>
              <div className='bg-slate-100 p-2'>
                <input
                  type='text'
                  placeholder='Enter Refferal Code'
                  name='refferredbycode'
                  value={data.refferredbycode}
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent' />
              </div>
            </div>

            <div>
              <label>Password :</label>
              <div className={`bg-slate-100 p-2 flex ${errors.password ? 'border border-red-500' : ''}`}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder='Enter Password'
                  value={data.password}
                  name='password'
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent' />
                <div className='cursor-pointer text-xl' onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
            </div>

            <div>
              <label>Confirm Password :</label>
              <div className={`bg-slate-100 p-2 flex ${errors.confirmPassword ? 'border border-red-500' : ''}`}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder='Enter Confirm password'
                  value={data.confirmPassword}
                  name='confirmPassword'
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent' />
                <div className='cursor-pointer text-xl' onClick={() => setShowConfirmPassword((prev) => !prev)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword}</p>}
            </div>

            <button className='bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>
              Sign Up
            </button>
          </form>

          <p className='my-5'>Already have account ? <Link to={"/login"} className=' text-sky-600 hover:text-sky-700 hover:underline'>Login</Link></p>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
