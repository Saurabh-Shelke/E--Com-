import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import ChangeDeliveryStatus from '../components/ChangeDeliveryStatus';
import * as XLSX from 'xlsx'; // Import xlsx for Excel manipulation
import Loader from '../components/Loader';
import {useSeller} from "../context/SellerContext"



const OrderList = () => {
    const [orderData, setOrderData] = useState([]);
    const { seller } = useSeller(); // Get seller data from context

    const [openDropdown, setOpenDropdown] = useState(false);
    const [loading, setLoading] = useState(true); // State for loading

    const [updateDeliveryDetails, setUpdateDeliveryDetails] = useState({
        _id: "",
        deliveryStatus: ""
    });

    // Function to export data to Excel
    const exportToExcel = (orders) => {
        const worksheetData = [];

        // Prepare data for Excel
        orders.forEach((order, orderIndex) => {
            order.products.forEach((product, productIndex) => {
                worksheetData.push({
                    'Sr. No.': orderIndex + 1,
                    'Customer Name': order.userId?.name || 'No name available',
                    'Product Name': product.name || 'No name available',
                    'Amount': `${order.amount} ₹`,
                    'Payment Status': order.status || 'No status available',
                    'Delivery Status': order.deliveryStatus || 'Ordered',
                    'Delivery Address': `${order.deliveryAddress?.street || ''}, ${order.deliveryAddress?.city || ''}, ${order.deliveryAddress?.state || ''} - ${order.deliveryAddress?.zip || ''}`,
                });
            });
        });

        // Create a new workbook and worksheet
        const ws = XLSX.utils.json_to_sheet(worksheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Orders");

        // Generate Excel file and trigger download
        XLSX.writeFile(wb, "order_list.xlsx");
    };

    const fetchAllOrders = async () => {
        setLoading(true); // Set loading to true when fetching starts

        try {
            const response = await fetch(SummaryApi.getOrders.url);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setOrderData(data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false); // Set loading to false when fetching ends
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const handleStatusChangeClick = (order) => {
        setUpdateDeliveryDetails(order);
        setOpenDropdown(true);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-800">Order List</h2>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
                    onClick={() => exportToExcel(orderData)}
                >
                    Get Excel Sheet
                </button>
            </div>
            {loading ? ( // Conditionally render Loader when loading is true
                <div className="flex justify-center items-center w-full h-64">
                    <Loader /> {/* Display Loader */}
                </div>
            ) : (
            <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                <thead>
                    <tr className="bg-gray-800 text-white text-left">
                        <th className="p-4">Sr. No.</th>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Payment Status</th>
                        <th className="p-4">Delivery Status</th>
                        <th className="p-4">Delivery Address</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                {orderData.map((order, orderIndex) => (
                    <tbody key={orderIndex} className="border-b border-gray-200 divide-y divide-gray-200">
                        {order.products.map((product, productIndex) => (
                            <tr key={`${orderIndex}-${productIndex}`} className="bg-white hover:bg-gray-100">
                                {productIndex === 0 && (
                                    <>
                                        <td
                                            rowSpan={order.products.length}
                                            className="p-4 text-center font-semibold text-gray-700 border-r border-gray-200"
                                        >
                                            {orderIndex + 1}
                                        </td>
                                        <td
                                            rowSpan={order.products.length}
                                            className="p-4 text-center font-semibold text-gray-700 border-r border-gray-200"
                                        >
                                            {order.userId?.name || 'No name available'}
                                        </td>
                                    </>
                                )}
                                <td className="p-4 text-center font-medium text-gray-700 border-r border-gray-200">
                                    {product.name || 'No name available'}
                                </td>
                                {productIndex === 0 && (
                                    <>
                                        <td rowSpan={order.products.length} className="p-4 text-center font-medium text-gray-700 border-r border-gray-200">
                                            {order.amount} ₹
                                        </td>
                                        <td rowSpan={order.products.length} className="p-4 text-center font-medium text-gray-700 border-r border-gray-200">
                                            {order.status || 'No status available'}
                                        </td>
                                        <td rowSpan={order.products.length} className="p-4 text-center font-medium text-gray-700 border-r border-gray-200">
                                            {order.deliveryStatus || 'Ordered'}
                                        </td>
                                        <td rowSpan={order.products.length} className="p-4 text-center font-medium text-gray-700 border-r border-gray-200">
                                            {order.deliveryAddress 
                                                ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.zip}`
                                                : 'No address available'}
                                        </td>
                                        <td rowSpan={order.products.length} className="p-4 text-center">
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                                                onClick={() => handleStatusChangeClick(order)}
                                            >
                                                Change Status
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                ))}
            </table>
            )}

            {openDropdown && (
                <ChangeDeliveryStatus
                    onClose={() => setOpenDropdown(false)}
                    _id={updateDeliveryDetails._id}
                    deliveryStatus={updateDeliveryDetails.deliveryStatus}
                    callFunc={fetchAllOrders}
                />
            )}
        </div>
    );
};

export default OrderList;
