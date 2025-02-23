import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Pagination, Autoplay } from 'swiper/modules';
import SummaryApi from '../common';

const BannerProduct = () => {
    const [bannerImages, setBannerImages] = useState([]);

    useEffect(() => {
        fetch(SummaryApi.allAdBanner.url)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.data) {
                    const bannersArray = Object.values(data.data);
                    setBannerImages(bannersArray);
                } else {
                    console.error('Unexpected data format:', data);
                }
            })
            .catch(error => console.error('Error fetching banner images:', error));
    }, []);

    return (
        <div className="relative mx-auto mt-4 sm:mt-10 rounded-lg w-full max-w-screen-xl overflow-hidden h-full">
            <div className="relative">
                {/* Render the first banner image only */}
                {bannerImages.length > 0 && (
                    <div className="w-full h-full">
                        <img
                            src={bannerImages[1].imageUrl}
                            className="w-full h-full object-cover rounded-md"
                            alt="Banner"
                        />
                        <span className="absolute top-2 right-2 bg-white bg-opacity-50 text-black text-xs px-2 py-1 rounded">
                            Ad
                        </span>
                    </div>
                )}

                {/* Fallback in case no banners are available */}
                {bannerImages.length === 0 && (
                    <div className="w-full h-full flex justify-center items-center bg-gray-200 rounded-md">
                        <p className="text-gray-500">No banner available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BannerProduct;