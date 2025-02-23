import React from 'react';
import img1 from "../../assest/img7.avif"
import customerimg from "../../assest/customer.jpeg"
import toolimg from "../../assest/tool.png"


const SellerHome = () => {
  return (
    <div className="font-sans p-8 max-w-7xl mx-auto">
<div
      className="text-center mb-16 p-4 rounded-md"
      style={{
        backgroundImage: `url(${img1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '20vh' // adjust height as needed
      }}
    >        <h1 className="text-4xl font-bold text-white">Grow Your Business with YML Mart!</h1>
        <p className="text-lg text-white mt-4">
          Join our platform to reach millions of customers and grow your business with ease.
        </p>
      </div>

      {/* Key Benefits Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Why Sell with Us?</h2>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-semibold text-gray-800">Access to a Huge Customer Base</h3>
            <p className="text-gray-600 mt-2">
              Reach a vast and engaged audience to increase your sales exponentially. Our platform connects you with customers actively searching for products just like yours.
            </p>
          </div>
          <div>
            <img src={customerimg} alt="Customer Base" className="w-full h-64 object-cover rounded-md shadow-lg" />
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 mt-10">
          <div>
            <img src={toolimg} alt="Effortless Management" className="w-full h-64 object-cover rounded-md shadow-lg" />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-semibold text-gray-800">Effortless Management Tools</h3>
            <p className="text-gray-600 mt-2">
              Manage your inventory, orders, and promotions effortlessly with our intuitive seller dashboard and tracking tools, designed to make selling easy and efficient.
            </p>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Success Stories</h2>
        <p className="text-center text-gray-600 mb-10">
          Our sellers have experienced tremendous growth by partnering with us. Here are some of their success stories.
        </p>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img src="user1.avif" alt="Success Story 1" className="w-44 h-40 rounded-full shadow-lg" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">John's Organic Goods</h3>
              <p className="text-gray-600">
                “Joining this platform helped me expand my organic food business beyond my local market. In just a few months, my sales doubled thanks to the access to a larger customer base.”
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img src="user2.avif" alt="Success Story 2" className="w-44 h-40 rounded-full shadow-lg" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Lily's Handmade Crafts</h3>
              <p className="text-gray-600">
                “I’ve been able to reach customers across the country and watch my business grow significantly. The platform’s tools make it easy to manage orders and maintain customer satisfaction.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps to Become a Seller Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">How to Become a Seller</h2>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
              1
            </div>
            <p className="text-gray-600">Sign up on our seller portal with your business details.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
              2
            </div>
            <p className="text-gray-600">Verify your information and upload product listings.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
              3
            </div>
            <p className="text-gray-600">Set up your inventory, pricing, and shipping options.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
              4
            </div>
            <p className="text-gray-600">Start selling and track your progress through our dashboard!</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SellerHome;
