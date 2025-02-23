import React, { useEffect } from "react";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import { IoIosCall, IoMdMail } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import yml from '../assest/banner/yml.png';

// Scroll to top component with smooth scroll
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

const Footer = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between overflow-hidden pt-0">
      <div className="flex-grow">
        {/* Page content goes here */}
      </div>

      {/* Footer Section */}
     

        {/* Bottom Section */}
        <div className="bg-sky-600 py-6">
          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-4">
            {/* Download Section */}
            <div className="text-center">
              <a href="/">
                      <img
                  src={yml}
                  alt="Logo"
                  className="mx-auto w-28 h-10"
                  style={{ borderRadius: '5px' }} // Adjust the value as needed
                  />
              </a>
              <h2 className="mt-3 text-lg font-bold text-white">Download our app</h2>
              <div className="flex justify-center items-center gap-3 mt-3">
  <a href="https://play.google.com/">
    <img src="Google-play.png" alt="Google Play" className="w-28 h-19" />
  </a>
  <a href="https://www.apple.com/in/app-store/">
    <img src="App-store.png" alt="App Store" className="w-28 " />
  </a>
</div>

            </div>

            {/* Special Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-white">Special</h3>
              <ul className="space-y-1 text-white">
                <li><Link to="/" className="hover:text-gray-300">Top Electronics</Link></li>
                <li><Link to="/" className="hover:text-gray-300">Latest Groceries</Link></li>
                <li><Link to="/" className="hover:text-gray-300">Best Medicines</Link></li>
                <li><Link to="/" className="hover:text-gray-300">Top Personal Care</Link></li>
              </ul>
            </div>

            {/* Account and Shipping Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-white">Account and Shipping</h3>
              <ul className="space-y-1 text-white">
                <li><Link to="/businessprofile" className="hover:text-gray-300">Accounts</Link></li>
                <li><Link to="/user-details" className="hover:text-gray-300">Profile</Link></li>
                <li><Link to="/cart" className="hover:text-gray-300">Check your Carts & Discounts</Link></li>
                <li><Link to="/refer" className="hover:text-gray-300">Refer a Friend</Link></li>
       

              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-white">Customer Policy</h3>
              <ul className="space-y-1 text-white">
                <li><Link to="/terms-and-condition" className="hover:text-gray-300">Terms And Conditions</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-gray-300">Privacy Policy</Link></li>
                <li><Link to="/shipping-policy" className="hover:text-gray-300">Shipping Policy</Link></li>
                <li><Link to="/replacement-policy" className="hover:text-gray-300">Replacement Policy</Link></li>
       

              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-white">About us & more</h3>
              <ul className="space-y-1 text-white">
             
                <li><Link to="/about" className="hover:text-gray-300">About Company</Link></li>
                <li><Link to="/contact" className="hover:text-gray-300">Contact Us</Link></li>
                <li><Link to="/askquestion" className="hover:text-gray-300">Ask Questions</Link></li>

              </ul>
            </div>

           
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-sky-900 py-6">
          <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-center">
            <div className="mb-4 lg:mb-0">
              <h4 className="text-lg font-semibold text-white">Start a conversation</h4>
              <p className="text-gray-400">
                Office No 1, Opposite Rajmudra Petrolpump, Murunji Road, Marunji, Mulshi, 411057.
              </p>
              <p className="text-gray-400">Pune, Maharashtra</p>
            </div>

            <div className="space-y-1 text-white">
              <p className="flex items-center gap-2">
                <IoIosCall className="text-lg" />
                +91-8850115960
              </p>
              <p className="flex items-center gap-2">
                <IoMdMail className="text-lg" />
                info@ymlmart.com
              </p>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="bg-gray-800 text-gray-400 py-2">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <p className="text-center md:text-left">&copy; 2024 | Yahshua Marketing Limited.</p>
            <div className="flex gap-3 justify-center md:justify-end mt-2 md:mt-0">
              <a href="https://www.instagram.com/ymlmartofficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaInstagram size={18} />
              </a>
              <a href="https://www.linkedin.com/company/yahshua-marketing-limited/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaLinkedin size={18} />
              </a>
              <a href="https://www.facebook.com/search/top?q=yahshua%20marketing%20limited" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FaFacebook size={18} />
              </a>
            </div>
            <div className="flex gap-3 justify-center md:justify-end mt-2 md:mt-0">
              <a href="#" className="hover:text-white">Terms and Conditions</a>
              <a href="#" className="hover:text-white">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
  );
};

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Footer />
    </>
  );
}
