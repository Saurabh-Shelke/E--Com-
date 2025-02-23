import React from 'react'
import { MdOutlineLocationOn } from "react-icons/md";
import { IoIosCall, IoMdMail } from "react-icons/io";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

const ContactUs = () => {
  return (
    <div>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-12 mx-auto">
          <div className="text-center">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">Feel free to contact us.</h2>
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Contact Us</h1>
          </div>
          <div className="lg:w-4/5 mx-auto flex flex-wrap items-center">
            <img alt="Ask a Question" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src="connectus.png" />

            {/* Right Section - Contact Info */}
            <div className="lg:w-1/2 md:w-full w-full flex flex-col justify-center lg:pl-12 space-y-8">

              {/* Address Section */}
              <div className="flex rounded-lg h-full bg-gray-100 px-8 flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-sky-600 text-white flex-shrink-0">
                    <MdOutlineLocationOn size={22} />
                  </div>
                  <h2 className="text-gray-900 text-lg title-font font-medium">Our Address</h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base">301, XYZ Building, Hinjewadi</p>
                  <p>Dist: Pune</p>
                </div>
              </div>

              {/* Socials Section */}
              <div className="flex rounded-lg h-full bg-gray-100 px-8 flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-sky-600 text-white flex-shrink-0">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <h2 className="text-gray-900 text-lg title-font font-medium">Social Handles</h2>
                </div>
                <div className="flex-grow flex space-x-4 mt-4">
                  <FaInstagram size={30} color="#E1306C" />
                  <FaTwitter size={30} color="#1DA1F2" />
                  <FaLinkedin size={30} color="#0077B5" />
                  <FaFacebook size={30} color="#1877F2" />
                </div>
              </div>

              {/* Call Us Section */}
              <div className="flex rounded-lg h-full bg-gray-100 px-8 flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-sky-600 text-white flex-shrink-0">
                    <IoIosCall size={22} />
                  </div>
                  <h2 className="text-gray-900 text-lg title-font font-medium">Contact details</h2>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    <IoIosCall size={22} className="mr-2" />
                    <p className="leading-relaxed text-base">+91 - 8888888888</p>
                  </div>
                  <div className="flex items-center">
                    <IoMdMail size={22} className="mr-2" />
                    <p className="leading-relaxed text-base">yahshuasoftware@gmail.com</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactUs
