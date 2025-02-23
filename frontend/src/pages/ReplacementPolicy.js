import React from "react";

const CancellationRefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Cancellation/Refund Policy
        </h1>
        <p className="text-gray-700 mb-6">
          Effective Date: <strong>17/11/2024</strong>
        </p>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Refund Policy
          </h2>
          <p className="text-gray-700">
            At YMLMart, we strive to ensure customer satisfaction with every
            purchase. However, we do not provide refunds for any products once
            they are delivered. If you encounter any issues with your order,
            such as receiving a damaged product or an incorrect item, we offer
            a replacement policy under specific conditions.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Replacement Conditions
          </h2>
          <p className="text-gray-700">
            A product is eligible for replacement only under the following
            circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>The product is damaged or defective upon delivery.</li>
            <li>An incorrect product was delivered to you.</li>
            <li>
              The product delivered does not match the description provided on
              our website.
            </li>
          </ul>
          <p className="text-gray-700 mt-2">
            To initiate a replacement request, customers must contact our
            support team at <strong>info@ymlmart.com</strong> within{" "}
            <strong>2 days</strong> of receiving the order. Proof of the
            issue, such as photos or videos, may be required to process your
            request.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Non-Eligible Scenarios
          </h2>
          <p className="text-gray-700">
            Replacement requests will not be entertained under the following
            conditions:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>The product shows signs of use or wear and tear after delivery.</li>
            <li>
              The product is returned without its original packaging, tags, or
              accessories.
            </li>
            <li>
              The issue is reported beyond the specified timeframe of{" "}
              <strong>2 days</strong>.
            </li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Order Cancellation
          </h2>
          <p className="text-gray-700">
            Orders can only be canceled if the cancellation request is made
            before the order is shipped. Once an order is dispatched, it cannot
            be canceled. To request a cancellation, please contact our support
            team immediately at <strong>info@ymlmart.com</strong>.
          </p>
        </section>
        <p className="text-gray-700">
          By purchasing from YMLMart, you agree to our Cancellation/Refund
          Policy. For further inquiries or assistance, feel free to reach out
          to our support team.
        </p>
      </div>
    </div>
  );
};

export default CancellationRefundPolicy;
