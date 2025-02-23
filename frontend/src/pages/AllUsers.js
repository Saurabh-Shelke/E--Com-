import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdModeEdit, MdDelete } from "react-icons/md";
import ChangeUserRole from '../components/ChangeUserRole';
import * as XLSX from 'xlsx'; // Import xlsx for Excel manipulation
import Loader from '../components/Loader';

const AllUsers = () => {
    const [allUser, setAllUsers] = useState([]);
    const [openUpdateRole, setOpenUpdateRole] = useState(false);
    const [loading, setLoading] = useState(true); // State for loading

    const [updateUserDetails, setUpdateUserDetails] = useState({
        email: "",
        name: "",
        role: "",
        phone: "", // Add phone field here
        _id: ""
    });

    // Function to export data to Excel
    const exportToExcel = (users) => {
        const worksheetData = [];

        // Prepare data for Excel
        users.forEach((user, index) => {
            worksheetData.push({
                'Sr. No.': index + 1,
                'Name': user.name || 'No name available',
                'Email': user.email || 'No email available',
                'Phone': user.mobileNo || 'No phone number available', // Add phone number
                'Role': user.role || 'No role available',
                'Created Date': moment(user.createdAt).format('LL') || 'No date available',
            });
        });

        // Create a new workbook and worksheet
        const ws = XLSX.utils.json_to_sheet(worksheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Users");


        // Generate Excel file and trigger download
        XLSX.writeFile(wb, "user_list.xlsx");
    };

    const fetchAllUsers = async () => {
        setLoading(true); // Set loading to true when fetching starts

        try {
            const fetchData = await fetch(SummaryApi.allUser.url, {
                method: SummaryApi.allUser.method,
                credentials: 'include'
            });
    
            const dataResponse = await fetchData.json();
    
            if (dataResponse.success) {
                setAllUsers(dataResponse.data);
            }
            console.log(dataResponse)
            
        }catch (error) {
            toast.error(error);
        } finally {
            setLoading(false); // Set loading to false when fetching ends
          }
        

    
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const deleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const fetchResponse = await fetch(`/api/delete-user/${userId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });

                const responseData = await fetchResponse.json();

                if (responseData.success) {
                    toast.success('User deleted successfully');
                    fetchAllUsers(); // Refresh the user list after deletion
                } else {
                    toast.error('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('An error occurred while deleting the user');
            }
        }
    };

    return (
        <div className='bg-white pb-4'>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">All Users</h2>

                <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
                    onClick={() => exportToExcel(allUser)}
                >
                    Get Excel Sheet
                </button>
            </div>

            {loading ? ( // Conditionally render Loader when loading is true
                <div className="flex justify-center items-center w-full h-64">
                    <Loader /> {/* Display Loader */}
                </div>
            ) : ( // Render table only when loading is false
                <table className='w-full userTable'>
                    <thead>
                        <tr className='bg-black text-white'>
                            <th>Sr.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th> {/* Add Phone Column */}
                            <th>Role</th>
                            <th>Created Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUser.map((el, index) => {
                            return (
                                <tr key={el._id}>
                                    <td>{index + 1}</td>
                                    <td>{el?.name}</td>
                                    <td>{el?.email}</td>
                                    <td>{el?.mobileNo || 'No phone number'}</td> {/* Display Phone */}
                                    <td>{el?.role}</td>
                                    <td>{moment(el?.createdAt).format('LL')}</td>
                                    <td>
                                        <button 
                                            className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white' 
                                            onClick={() => {
                                                setUpdateUserDetails(el);
                                                setOpenUpdateRole(true);
                                            }}
                                        >
                                            <MdModeEdit />
                                        </button>
                                        <button 
                                            className='bg-red-100 p-2 rounded-full cursor-pointer hover:bg-red-500 hover:text-white ml-2'
                                            onClick={() => deleteUser(el._id)}
                                        >
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            {openUpdateRole && (
                <ChangeUserRole 
                    onClose={() => setOpenUpdateRole(false)} 
                    name={updateUserDetails.name}
                    email={updateUserDetails.email}
                    phone={updateUserDetails.phone} // Add phone to update details
                    role={updateUserDetails.role}
                    userId={updateUserDetails._id}
                    callFunc={fetchAllUsers}
                />
            )}
        </div>
    );
};

export default AllUsers;
