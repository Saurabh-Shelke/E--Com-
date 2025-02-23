import React from 'react'
import { useState } from 'react';
import emailjs from 'emailjs-com';


const AskQuestion = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
    
        const serviceID = 'service_rkhrgav';
        const templateID = 'template_uz7wsuw';
        const userID = 'ZtK6JUqPrOpOKaDoa';
    
        emailjs.send(serviceID, templateID, formData, userID)
          .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            alert("Your message has been sent successfully!");
            setFormData({ name: '', email: '', message: '' }); // Clear form after submission
          })
          .catch((error) => {
            console.log('FAILED...', error);
            alert("Failed to send the message, please try again.");
          });
      };
  return (
    <div>
<section class="text-gray-600 body-font overflow-hidden">
  <div class="container px-5 py-12  mx-auto">
    <div class="text-center ">
      <h2 class="text-sm title-font text-gray-500 tracking-widest">Need Help?</h2>
      <h1 class="text-gray-900 text-2xl sm:text-3xl title-font font-medium mb-4">Ask a Question</h1>
      {/* <p class="leading-relaxed max-w-2xl mx-auto text-base sm:text-lg">Feel free to reach out with your queries. Our team is here to assist you.</p> */}
    </div>
    <div class="lg:w-4/5 mx-auto flex flex-wrap items-center">
      <img alt="Ask a Question" class="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src="ask1.png" />
      <div class="lg:w-1/2 w-full mt-6 lg:mt-0">
        <form onSubmit={handleSubmit} className="flex flex-wrap">
          <div className="p-2 w-full">
            <div className="relative">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
              />
            </div>
          </div>
          <div className="p-2 w-full">
            <div className="relative">
              <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
              />
            </div>
          </div>
          <div className="p-2 w-full">
            <div className="relative">
              <label htmlFor="message" className="leading-7 text-sm text-gray-600">Question</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                required
              ></textarea>
            </div>
          </div>
          <div className="p-2 w-full">
            <button
              type="submit"
              className="flex mx-auto text-white bg-sky-600 border-0 py-2 px-8 focus:outline-none hover:bg-sky-700 rounded text-lg"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>



  </div>
  )
}

export default AskQuestion
