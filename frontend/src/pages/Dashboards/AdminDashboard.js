import React, { useEffect, useState } from 'react';
import SummaryApi from '../../common';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    const handleReset = async () => {
        // alert(SummaryApi.reset.method)
        try {
            const response = await fetch(SummaryApi.reset.url, {
                method: SummaryApi.reset.method,
                credentials: "include",
              
              });

            const data = await response.json();
            console.log(data.message)

            // Recalculate total revenue excluding canceled orders
     
        } catch (error) {
            console.error('Error resetting Total Purchase of user:', error);
        }
    };


    const fetchOrders = async () => {
        try {
            const response = await fetch(SummaryApi.getOrders.url);

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            console.log('Fetched orders:', data.orders); // Debugging line to check fetched orders
            setOrders(data.orders);

            // Recalculate total revenue excluding canceled orders
            const revenue = data.orders.reduce((acc, order) => {
                return order.status === 'paid' ? acc + order.amount : acc;
            }, 0);
            setTotalRevenue(revenue);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/cancel`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to cancel the order');
            }

            // Re-fetch the orders to update the dashboard
            fetchOrders();
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.deliveryStatus === 'Ordered').length;
    const deliveredOrders = orders.filter(order => order.deliveryStatus === 'Delivered').length;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Orders</h3>
                    <p>{totalOrders}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Pending Orders</h3>
                    <p>{pendingOrders}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Delivered Orders</h3>
                    <p>{deliveredOrders}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Revenue</h3>
                    <p>₹{totalRevenue.toFixed(2)}</p>
                </div>
            </div>
   
        </div>
    );
};

export default Dashboard;