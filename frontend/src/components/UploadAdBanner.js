import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import uploadImage from '../helpers/uploadImage';
import SummaryApi from '../common';
import { useUser } from '../context/userContext'; // Import UserContext to get user details
import ROLE from '../common/role'; // Import roles
import Context from "../context/index"; // Assuming context holds the authToken

const UploadAdBannerForm = ({ onClose, onUploadSuccess }) => {
  const { user } = useUser(); // Get user details from context
  const [image, setImage] = useState(null);
  const { authToken } = useContext(Context); // Get the authToken from Context
  const [bannerId, setBannerId] = useState(null); // For managing banner deletion
  const navigate = useNavigate(); // Initialize navigate hook

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please select an image');
      return;
    }

    if (!user || (user.role !== ROLE.ADMIN && user.role !== ROLE.SUPER_ADMIN)) {
      alert('You do not have permission to upload banners.');
      return;
    }

    try {
      const uploadedImage = await uploadImage(image);

      const response = await fetch(SummaryApi.uploadAdBanner.url, {
        method: SummaryApi.uploadAdBanner.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          userId: user._id,
          imageUrl: uploadedImage.secure_url,
        }),
      });

      if (response.ok) {
        alert('Ad banner uploaded successfully!');
        onUploadSuccess();
        setBannerId(uploadedImage.secure_url); // Save the image ID or URL for potential deletion
        onClose();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error uploading ad banner');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading image');
    }
  };

  const handleDelete = async () => {
    if (!bannerId) {
      alert('No banner to delete.');
      return;
    }

    try {
      const response = await fetch(`${SummaryApi.deleteAdBanner.url}/${bannerId}`, {
        method: SummaryApi.deleteAdBanner.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        alert('Banner deleted successfully!');
        setBannerId(null); // Reset bannerId after deletion
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error deleting banner');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting banner');
    }
  };

  const handleCancel = () => {
    setImage(null); // Reset the selected image
    navigate(-1); // Navigate back one step
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Upload New Ad Banner</h2>
        <input
          type="file"
          accept="image/*"
          className="mb-4"
          onChange={handleImageChange}
        />
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Upload
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          {bannerId && (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete Banner
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadAdBannerForm;
