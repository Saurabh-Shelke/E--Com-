import React from 'react'

const contact = () => {
  return (
    <div>
      <section class="text-gray-600 body-font relative">
  <div class="container px-5 py-24 mx-auto flex flex-wrap">
    <div class="lg:w-1/2 md:w-full w-full mb-10 lg:mb-0">
      <img src="your-image-source.jpg" alt="Contact Image" class="w-full object-cover h-96 rounded"/>
    </div>
    <div class="lg:w-1/2 md:w-full w-full flex flex-col justify-center lg:pl-12">
      <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Contact Us</h1>
      <p class="leading-relaxed mb-8">Feel free to contact us.</p>
      <div class="flex flex-col">
        <div class="mb-6">
          <h2 class="text-lg font-medium title-font text-gray-900">Address</h2>
          <p class="leading-relaxed">123 Main Street, City, Country</p>
        </div>
        <div class="mb-6">
          <h2 class="text-lg font-medium title-font text-gray-900">Email</h2>
          <p class="leading-relaxed">info@example.com</p>
        </div>
        <div class="mb-6">
          <h2 class="text-lg font-medium title-font text-gray-900">Phone</h2>
          <p class="leading-relaxed">+123 456 7890</p>
        </div>
        <div class="flex space-x-4">
          <a href="#" class="text-gray-600 hover:text-gray-900">
            <svg fill="currentColor" class="w-6 h-6" viewBox="0 0 24 24">
              {/* <!-- Facebook Icon --> */}
            </svg>
          </a>
          <a href="#" class="text-gray-600 hover:text-gray-900">
            <svg fill="currentColor" class="w-6 h-6" viewBox="0 0 24 24">
              {/* <!-- Twitter Icon --> */}
            </svg>
          </a>
          <a href="#" class="text-gray-600 hover:text-gray-900">
            <svg fill="currentColor" class="w-6 h-6" viewBox="0 0 24 24">
              {/* <!-- Instagram Icon --> */}
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

    </div>
  )
}

export default contact
