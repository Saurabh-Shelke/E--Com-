import React from 'react';
import { Link } from 'react-router-dom'; // Ensure you have react-router-dom installed
import banner from '../assest/festival.jpg'; // Update the path if needed
import dining from '../assest/Festive offers/Dining.jpg';
import decor from '../assest/Festive offers/Homedecor.jpg';
import grocery from '../assest/Festive offers/Top groceries Items.jpg';
import electronics from '../assest/Festive offers/Top Electronics.jpg';
import phones from '../assest/Festive offers/Latest phones.jpg';
import stationary from '../assest/Festive offers/stationary.jpg';

// Banner Component
const Banner = () => {
  return (
    <div className="relative mx-auto mt-4 sm:mt-10 rounded-lg w-full overflow-hidden">
    {/* Banner Image */}
    <img 
      src={banner} 
      alt="Banner" 
      className="w-full h-auto rounded-lg object-cover" // Ensure the image covers the area properly
    />
  </div>
  
  );
};

// Card Component (each card is different)
const Card = ({ title, offer, link, imgSrc }) => {
  return (
    <Link to={link} className="bg-yellow-300 p-2 sm:p-3 md:p-4 rounded-lg text-center shadow-lg transition-transform transform hover:scale-105">
      {/* Container for Image */}
      <div className="mb-2 sm:mb-3 rounded-lg overflow-hidden">
        <img src={imgSrc} alt={title} className="w-full h-auto max-h-32 object-contain" /> {/* Ensure image fits inside without distortion */}
      </div>
      <h3 className="text-xs sm:text-sm md:text-lg font-semibold">{title}</h3>
      <p className="text-xs sm:text-sm mt-1 sm:mt-2">{offer}</p>
    </Link>
  );
};

// Main Component
const BannerPage = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Banner */}
      <Banner />

      {/* Minimal Space between Banner and Cards */}
      <div className="py-2 sm:py-3"></div>

      {/* Cards Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mx-auto w-full px-2 sm:px-4 lg:px-8">
        {/* Each card with unique content */}
        <Card title="Kitchen & Dining" offer="Up to 70% Off" link="/product-category?category=home%20care" imgSrc={dining}  />
        <Card title="Home Furnishings & Decor" offer="From ₹99" link="/product-category?category=home%20decor" imgSrc={decor} />
        <Card title="Top Groceries Items" offer="From ₹300" link="/product-category?category=groceries" imgSrc={grocery} />
        <Card title="Top Electronics" offer="Up to 40% Off" link="/product-category?category=electronics" imgSrc={electronics} />
        <Card title="Latest phones" offer="From ₹6,299" link="/product-category?subcategory=mobile%20phones" imgSrc={phones} />
        <Card title="Now Buy Stationary" offer="From ₹99" link="/product-category?category=stationary" imgSrc={stationary} />
      </div>
    </div>
  );
};

export default BannerPage;
