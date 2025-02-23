import React from 'react';

import babycare from '../assest/Deals & Offers/babycare.jpg';
import Earbuds from '../assest/Deals & Offers/earbuds.jpg';
import Fashion from '../assest/Deals & Offers/Fashion.jpg';
import Gifting from '../assest/Deals & Offers/Gifting.jpg';
import Kitchen from '../assest/Deals & Offers/Kitchen.jpg';
import Homedecor from '../assest/Deals & Offers/Homedecor.jpg';
import Oil from '../assest/Deals & Offers/Oil.jpg';
import Personal from '../assest/Deals & Offers/Personal Care.jpg';
import Electronics from '../assest/Deals & Offers/Wearables.jpg';
import Softdrink from '../assest/Deals & Offers/Softdrink.jpg';

// List of card data
const cardData = [
  { title: 'Baby Care Deals', offer: 'From ₹299', imgSrc: babycare, discount: 'Up to 80% Off', link: '/product-category?subcategory=mom,%20baby%20care' },
  { title: 'Earbuds & More', offer: 'From ₹999', imgSrc: Earbuds , discount: 'Up to 75% Off', link: '/product-category?subcategory=airpods' },
  { title: 'Fashion Deals', offer: 'Up to 75% Off', imgSrc: Fashion , discount: 'Up to 75% Off', link: '/product-category?category=beauty' },
  { title: 'Gifting Store', offer: 'Up to 80% Off', imgSrc: Gifting , discount: 'Up to 80% Off', link: '/product-category?category=gifts,%20hampers' },
  { title: 'Kitchen Items', offer: 'Up to 80% Off', imgSrc: Kitchen , discount: 'Up to 80% Off', link: '/product-category?category=kitchenware' },
  { title: 'Home Decor Deals', offer: 'From ₹99', imgSrc: Homedecor, discount: 'Up to 60% Off', link: '/product-category?category=kitchenware' },
  { title: 'Oil & Ghee', offer: 'Under ₹299', imgSrc: Oil , discount: 'Up to 50% Off', link: '/product-category?category=groceries' },
  { title: 'Do your Personal Care', offer: 'From ₹99', imgSrc: Personal, discount: 'Up to 70% Off', link: '/product-category?category=personal%20care' },
  { title: 'Wearable Deals', offer: 'From ₹1299', imgSrc: Electronics, discount: 'Up to 50% Off', link: '/product-category?category=electronics' },
  { title: 'Snacks, Cold Drinks & Juices', offer: 'From ₹20', imgSrc: Softdrink, discount: 'Up to 40% Off', link: '/product-category?subcategory=biscuits,%20drinks' },
];

// Card component
const Card = ({ title, offer, imgSrc, discount, link }) => {
  return (
    <a href={link} className="block">
      <div className="bg-yellow-200 rounded-lg shadow-lg p-3 sm:p-4 flex flex-col items-center text-center hover:scale-105 transition-transform transform">
        <div className="w-full bg-gray-200 rounded-lg overflow-hidden mb-3">
          <img src={imgSrc} alt={title} className="w-full" />
        </div>
        <h3 className="text-sm sm:text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600">{offer}</p>
        <p className="text-xs sm:text-sm text-red-500 font-bold">{discount}</p>
      </div>
    </a>
  );
};

// Main component
const CardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Deals & Offers</h1>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
          {cardData.map((card, index) => (
            <Card 
              key={index} 
              title={card.title} 
              offer={card.offer} 
              imgSrc={card.imgSrc} 
              discount={card.discount} 
              link={card.link} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardPage;
