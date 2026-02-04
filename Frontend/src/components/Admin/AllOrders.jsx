import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


const AllOrders = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-gray-100 p-12">
      
      <div className="flex absolute top-3 md:left-[1rem] rounded bg-green-200 p-1 hover:bg-green-300">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

 
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          All Orders
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor and manage all platform orders
        </p>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">1,420</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Pending</p>
          <h2 className="text-3xl font-bold text-yellow-600 mt-2">86</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Completed</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">1,210</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Cancelled</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">124</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

        <input
          type="text"
          placeholder="Search by Order ID, Buyer or Seller"
          className="w-full md:w-1/3 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <select className="w-full md:w-1/4 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
          <option>All Status</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3">#ORD1023</td>
              <td className="px-4 py-3">Hotel Annapurna</td>
              <td className="px-4 py-3">Ram Bahadur</td>
              <td className="px-4 py-3">Rs. 25,000</td>
              <td className="px-4 py-3">
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                  Pending
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <button className="text-blue-600 hover:underline">
                  View
                </button>
              </td>
            </tr>

            <tr className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3">#ORD1024</td>
              <td className="px-4 py-3">Everest Traders</td>
              <td className="px-4 py-3">Sita Devi</td>
              <td className="px-4 py-3">Rs. 18,500</td>
              <td className="px-4 py-3">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  Completed
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <button className="text-blue-600 hover:underline">
                  View
                </button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AllOrders;
