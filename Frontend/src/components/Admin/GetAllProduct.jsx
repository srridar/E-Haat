import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";



const GetAllProduct = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-gray-100 p-12">

      {/* Page Header */}
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
          All Products
        </h1>
        <p className="text-gray-500 mt-1">
          Review, approve, and manage listed products
        </p>
      </div>

      {/* Product Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Total Products</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">2,340</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Approved</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">1,980</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Pending</p>
          <h2 className="text-3xl font-bold text-yellow-600 mt-2">260</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Rejected</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">100</h2>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

        <input
          type="text"
          placeholder="Search by product name or seller"
          className="w-full md:w-1/3 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <select className="w-full md:w-1/4 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
          <option>All Status</option>
          <option>Approved</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>

      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium">Fresh Tomatoes</td>
              <td className="px-4 py-3">Ram Bahadur</td>
              <td className="px-4 py-3">Vegetables</td>
              <td className="px-4 py-3">Rs. 90/kg</td>
              <td className="px-4 py-3">
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                  Pending
                </span>
              </td>
              <td className="px-4 py-3 text-center space-x-3">
                <button className="text-blue-600 hover:underline">
                  View
                </button>
                <button className="text-green-600 hover:underline">
                  Approve
                </button>
                <button className="text-red-600 hover:underline">
                  Reject
                </button>
              </td>
            </tr>

            <tr className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium">Organic Potatoes</td>
              <td className="px-4 py-3">Sita Devi</td>
              <td className="px-4 py-3">Vegetables</td>
              <td className="px-4 py-3">Rs. 60/kg</td>
              <td className="px-4 py-3">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  Approved
                </span>
              </td>
              <td className="px-4 py-3 text-center space-x-3">
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

export default GetAllProduct;
