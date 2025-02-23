import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import SummaryApi from '../common'

const VerifyOTP = () => {
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("") // You need to pass the email from the previous page or localStorage
  const navigate = useNavigate()

  const handleOnChange = (e) => {
    setOtp(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const dataResponse = await fetch(SummaryApi.verifyOTP.url, {
      method: SummaryApi.verifyOTP.method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, otp })
    })

    const dataApi = await dataResponse.json()

    if (dataApi.success) {
      toast.success(dataApi.message)

      // Set authentication state in local storage or context
      localStorage.setItem('authToken', dataApi.token) // Assuming the response includes a token

      // Redirect to the home page
      navigate("")
    } else if (dataApi.error) {
      toast.error(dataApi.message)
    }
  }

  return (
    <section id='verify-otp'>
        <div className='mx-auto container p-4'>
            <div className='bg-white p-5 w-full max-w-sm mx-auto'>
                <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
                  <div className='grid'>
                      <label>Enter OTP that you received on your Email:</label>
                      <div className='bg-slate-100 p-2'>
                          <input 
                              type='text' 
                              placeholder='Enter OTP' 
                              value={otp}
                              onChange={handleOnChange}
                              required
                              className='w-full h-full outline-none bg-transparent'/>
                      </div>
                  </div>
                  <button className='bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Verify OTP</button>
                </form>
            </div>
        </div>
    </section>
  )
}

export default VerifyOTP
