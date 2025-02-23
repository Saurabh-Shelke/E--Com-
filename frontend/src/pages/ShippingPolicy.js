import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Shipping Policy
        </h1>
        <p className="text-gray-700 mb-6">
          Effective Date: <strong>17/11/2024</strong>
        </p>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Shipping Process
          </h2>
          <p className="text-gray-700">
            At YMLMart, we ensure that all orders are delivered directly to your
            doorstep for a seamless shopping experience. Please note that cash
            on delivery (COD) is currently not available.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Product Delivery Timelines
          </h2>
          <p className="text-gray-700">
            Certain daily-use products such as Biscuits & Drinks, Fruits &
            Vegetables, Dry Fish, Cooking Essentials, Dairy & Bakery, Mom &
            Baby Care, and Disposables are eligible for instant delivery. Other
            products will be delivered within 3-4 days of order placement.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Delivery Location
          </h2>
          <p className="text-gray-700">
            We currently provide delivery services exclusively within Pune city
            limits to ensure fast and reliable service.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Shipping Charges
          </h2>
          <p className="text-gray-700">
            Delivery is free for orders above ₹500. For orders below ₹500, a
            shipping charge of ₹40 per kilometer will apply. The total shipping
            cost is calculated at checkout based on your location.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Order Tracking
          </h2>
          <p className="text-gray-700">
            Customers will receive a tracking link via email or SMS once their
            order has been dispatched. This allows you to monitor your order’s
            status and estimated delivery time.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Damaged or Lost Packages
          </h2>
          <p className="text-gray-700">
            If your package is damaged or lost during transit, please contact
            our support team at <strong>info@ymlmart.com</strong> within{" "}
            <strong>2 days</strong> from the delivery date. Our team will
            assist you in resolving the issue promptly.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
