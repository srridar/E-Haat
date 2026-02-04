import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const GetAllUser = () => {
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
          All Users
        </h1>
        <p className="text-gray-500 mt-1">
          Manage and monitor all registered users
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

        <input
          type="text"
          placeholder="Search by name or email"
          className="w-full md:w-1/3 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <select className="w-full md:w-1/4 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
          <option>All Users</option>
          <option>Buyers</option>
          <option>Sellers</option>
        </select>

      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3">Ram Bahadur</td>
              <td className="px-4 py-3">ram@gmail.com</td>
              <td className="px-4 py-3">Seller</td>
              <td className="px-4 py-3">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  Active
                </span>
              </td>
              <td className="px-4 py-3 text-center space-x-3">
                <button className="text-blue-600 hover:underline">
                  View
                </button>
                <button className="text-red-600 hover:underline">
                  Block
                </button>
              </td>
            </tr>

            <tr className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3">Sita Devi</td>
              <td className="px-4 py-3">sita@gmail.com</td>
              <td className="px-4 py-3">Buyer</td>
              <td className="px-4 py-3">
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                  Pending
                </span>
              </td>
              <td className="px-4 py-3 text-center space-x-3">
                <button className="text-blue-600 hover:underline">
                  View
                </button>
                <button className="text-red-600 hover:underline">
                  Block
                </button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
};

export default GetAllUser;
