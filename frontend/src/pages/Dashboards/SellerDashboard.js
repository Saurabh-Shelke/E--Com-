import React, { useState, useEffect } from 'react';
import { FaRegCircleUser, FaClipboardList, FaClock, FaChartPie } from 'react-icons/fa6';
import { FaBoxes } from 'react-icons/fa';
import OrderList from '../OrderList';
import SellerProductList from '../SellerProductList';
import SellerOrderList from '../SellerProductList';
import { useSeller } from '../../context/SellerContext';
import SummaryApi from '../../common';

const PendingOrders = () => <div>Pending Orders Page</div>;

const SellerDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const { seller } = useSeller();
  const [allProducts, setAllProducts] = useState([]);
  const [orderData, setOrderData] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${SummaryApi.allSellerProduct.url}?sellerId=${seller._id}`);
      const dataResponse = await response.json();
      setAllProducts(dataResponse?.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${SummaryApi.getOrders.url}?sellerId=${seller._id}`);
      const data = await response.json();
      setOrderData(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (seller?._id) {
      fetchProducts();
      fetchOrders();
    }
  }, [seller]);

  const totalProducts = allProducts.length;
  const Ordered = orderData.filter(order => order.deliveryStatus === 'Ordered').length;
  const totalOrders = orderData.length;
  const deliveredOrders = orderData.filter(order => order.deliveryStatus === 'Delivered').length;
  const processingOrders = orderData.filter(order => order.deliveryStatus === 'Processing').length;
  const ShippedOrders = orderData.filter(order => order.deliveryStatus === 'Shipped').length;
  const intransitOrders = orderData.filter(order => order.deliveryStatus === 'In-Transit').length;
  const outofdeliveryOrders = orderData.filter(order => order.deliveryStatus === 'Out Of Delivery').length;
  const cancelledOrders = orderData.filter(order => order.deliveryStatus === 'Cancelled').length;

  



  const renderPage = () => {
    switch (activePage) {
      case 'orderList':
        return <SellerOrderList />;
      case 'productList':
        return <SellerProductList />;
      case 'pendingOrders':
        return <PendingOrders />;
      default:
        return (
          <div>
            <h1 className="text-4xl font-bold text-sky-700 mb-10 text-center">Seller Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <DashboardCard title="Total Products" value={totalProducts} />
              <DashboardCard title="Ordered" value={Ordered} />
              <DashboardCard title="Total Orders" value={totalOrders} />
              <DashboardCard title="Delivered Orders" value={deliveredOrders} />
              <DashboardCard title="Processing Orders" value={processingOrders} />
              <DashboardCard title="Shipped Orders" value={ShippedOrders} />
              <DashboardCard title="In-Transit Orders" value={intransitOrders} />
              <DashboardCard title="Out Of Delivery Orders" value={outofdeliveryOrders} />
              <DashboardCard title="Cancelled Orders" value={cancelledOrders} />


              <DashboardCard title="Total Revenue" value={`₹${seller?.totalRevenue}`} colSpan />
            </div>
          </div>
        );
    }
  };

  const DashboardCard = ({ title, value, colSpan = false }) => (
    <div className={`bg-white p-8 shadow-lg rounded-lg text-center transition-all duration-200 transform hover:scale-105 ${colSpan ? 'col-span-2' : ''}`}>
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className="text-3xl font-bold text-sky-700">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-blue-50">
      <aside className="w-1/5 bg-sky-700 text-white p-6 space-y-8">
        <div className="flex items-center mb-6">
          <FaRegCircleUser className="rounded-full w-12 h-12 mr-4" />
          <div>
            <h2 className="text-xl font-semibold">{seller?.fullName}</h2>
            <p className="text-sm">{seller?.email}</p>
          </div>
        </div>
        <nav className="space-y-4">
          <SidebarButton
            isActive={activePage === 'dashboard'}
            icon={<FaChartPie />}
            label="Dashboard"
            onClick={() => setActivePage('dashboard')}
          />
          <SidebarButton
            isActive={activePage === 'orderList'}
            icon={<FaClipboardList />}
            label="Order List"
            onClick={() => setActivePage('orderList')}
          />
          <SidebarButton
            isActive={activePage === 'productList'}
            icon={<FaBoxes />}
            label="Product List"
            onClick={() => setActivePage('productList')}
          />
          <SidebarButton
            isActive={activePage === 'pendingOrders'}
            icon={<FaClock />}
            label="Pending Orders"
            onClick={() => setActivePage('pendingOrders')}
          />
        </nav>
      </aside>

      <main className="flex-1 p-10">{renderPage()}</main>
    </div>
  );
};

const SidebarButton = ({ isActive, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full py-3 px-4 rounded-lg text-left transition-all duration-200 ${
      isActive ? 'bg-sky-800 text-white shadow-md' : 'hover:bg-sky-800 hover:text-white'
    }`}
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </button>
);

export default SellerDashboard;
