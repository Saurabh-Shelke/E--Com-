import React, { useEffect, useState, useContext } from 'react';
import SummaryApi from '../common';
import { FaTrashAlt } from 'react-icons/fa';
import { useUser } from '../context/userContext'; 
import ROLE from '../common/role'; 
import Context from "../context/index";
import UploadBanner from '../components/UploadAdBanner';

const AlladBanners = () => {
    const { user } = useUser(); // Get user details from context
    const [allBanner, setAllBanner] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openUploadBanner, setOpenUploadBanner] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const { authToken } = useContext(Context); 

    const fetchAllBanner = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.allAdBanner.url);
            const dataResponse = await response.json();
            const bannersArray = dataResponse?.data ? Object.values(dataResponse.data) : [];
            setAllBanner(bannersArray);
        } catch (error) {
            console.error('Error fetching banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this banner?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${SummaryApi.deleteAdBanner.url}/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Banner deleted successfully');
                fetchAllBanner(); // Refresh the banners after deletion
            } else {
                alert('Failed to delete banner');
            }
        } catch (error) {
            console.error('Error deleting banner:', error);
        }
    };

    const handleUploadBanner = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }
        if (!user || (user.role !== ROLE.ADMIN && user.role !== ROLE.SUPER_ADMIN)) {
            alert('You do not have permission to upload banners.');
            return;
        }

        const formData = new FormData();
        formData.append('banner', selectedFile);

        try {
            const response = await fetch(SummaryApi.uploadAdBanner.url, {
                method: 'POST',
                credentials: 'include', // Correct spelling
                headers: {
                  'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`, // Keep the auth token
                },
                body: formData, // Use formData directly without setting Content-Type
            });

            if (response.ok) {
                alert('Banner uploaded successfully');
                setOpenUploadBanner(false); // Close the form after successful upload
                fetchAllBanner(); // Refresh the banners after upload
            } else {
                alert('Failed to upload banner');
                const errorData = await response.json();
                console.error('Upload Error:', errorData);
            }
        } catch (error) {
            console.error('Error uploading banner:', error);
        }
    };

    useEffect(() => {
        fetchAllBanner();
    }, []);

    if (loading) {
        return <p>Loading banners...</p>; // Display loading state
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-14 pl-5">
            {/* Render existing banners if they exist */}
            {allBanner.length > 0 ? (
                allBanner.map((banner) => (
                    <div key={banner._id} className="relative w-60 h-36 bg-gray-200 flex items-center justify-center">
                        <img
                            src={banner.imageUrl || 'placeholder-image-url'}
                            alt="Banner"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex justify-center items-center">
                            <button
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-700"
                                onClick={() => handleDelete(banner._id)}
                            >
                                <FaTrashAlt size={18} />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="col-span-full text-center text-gray-500">No banners available.</p> // Show when no banners
            )}

            {/* Empty banner as the last item - Always render for adding new banner */}
            <div
                className="relative w-60 h-36 bg-gray-200 flex items-center justify-center cursor-pointer"
                onClick={() => setOpenUploadBanner(true)} 
            >
                <div className="text-gray-500">+ Add New Banner</div>
            </div>

            {/* Banner Upload Form - shown when openUploadBanner is true */}
            {
                openUploadBanner && (
                    <UploadBanner onClose={() => setOpenUploadBanner(false)} fetchData={fetchAllBanner} />
                )
            }
        </div>
    );
};

export default AlladBanners;
