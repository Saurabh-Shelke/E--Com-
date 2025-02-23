import React from "react";

const ReferPage = () => {
  return (
    <div className="bg-gray-300 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <div className="text-sm text-white mb-2">insert background img</div>
        <h1 className="text-2xl font-bold text-black">Wellcome message</h1>
      </div>

      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-black">$00</div>
        <div className="text-sm text-black">NO of refer</div>
      </div>

      <div className="w-full max-w-xs mb-6">
        <button className="bg-white w-full py-3 rounded-full shadow-md text-black font-semibold">
          Refer Link/ Button
        </button>
      </div>

      <div className="text-center mb-6">
        <div className="text-sm font-bold text-black mb-2">REDEEM NOW</div>
        <button className="bg-white w-full max-w-xs py-3 rounded-full shadow-md text-red-600 font-semibold">
          UPI CASH
        </button>
      </div>
    </div>
  );
};

export default ReferPage;
