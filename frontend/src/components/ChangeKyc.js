import React, { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";

// const backend_Domin = process.env.REACT_APP_API_URL;
const backend_Domin = process.env.REACT_APP_LOCALHOST_URI;


const ChangeKycStatus = ({ _id, kycStatus, callFunc, onClose, setGlobalKycStatus }) => {
    const [newStatus, setNewStatus] = useState(kycStatus);

    // Log _id and kycStatus for debugging
    useEffect(() => {
        console.log('KYC ID:', _id); // Ensure this is correctly passed
        console.log('Initial Status:', kycStatus); // Ensure the initial status is correct
    }, [_id, kycStatus]);

    const handleStatusChange = async () => {
        if (!_id) {
            alert('KYC ID is missing or invalid!');
            return;
        }

        try {
            // Log the status and KYC ID before making the request
            console.log(`Updating KYC ID: ${_id} with Status: ${newStatus}`);

            const response = await fetch(`${backend_Domin}/api/upload-kyc/${_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ kycStatus: newStatus,
                  kycId : _id
                 }), // Use the correct field name
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Response Error:', errorData);
                alert('Failed to update KYC status.');
                throw new Error('Failed to update KYC status');
            }
            if (response.ok) {
                const data = await response.json();
                callFunc(); 
                setGlobalKycStatus(newStatus); // Set the new status globally
                onClose(); 
            } else {
                console.error('Failed to update KYC status.');
            }
        } catch (error) {
            console.error('Error updating KYC status:', error);
        }
    };

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-between items-center bg-slate-200 bg-opacity-50'>
            <div className='mx-auto bg-white shadow-md p-4 w-full max-w-sm'>
                <button className='block ml-auto' onClick={onClose}>
                    <IoMdClose />
                </button>

                <h1 className='pb-4 text-lg font-medium'>Change KYC Status</h1>
                <p><strong>KYC ID:</strong> {_id ? _id : 'N/A'}</p>
                <div className='flex items-center justify-between my-4'>
                    <p>Status:</p>
                    <select 
                        className='border px-4 py-1' 
                        value={newStatus} 
                        onChange={(e) => setNewStatus(e.target.value)}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Rejected">Rejected</option>
                        {/* Add other statuses as needed */}
                    </select>
                </div>

                <button 
                    className='w-fit mx-auto block py-1 px-3 rounded-full bg-sky-600 text-white hover:bg-sky-700' 
                    onClick={handleStatusChange}
                >
                    Change KYC Status
                </button>
            </div>
        </div>
    );
};

export default ChangeKycStatus;
