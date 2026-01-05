import React from "react";

const DashBoard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">

      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[var(--secondary-orange)]">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of platform performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-green-700 text-md">Total Users</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">1,240</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-green-700 text-md">Sellers</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">320</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-green-700 text-md">Transporters</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">50</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-green-700 text-md">Products</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">1,850</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-yellow-600 text-md">Pending Approvals</p>
          <h2 className="text-2xl font-bold text-red-600 mt-2">12</h2>
        </div>

      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Platform Analytics
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
            Charts will be here
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between ">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Activity
            </h2>

            <ul className="space-y-4">
              <li className="flex justify-between text-sm">
                <span className="text-gray-600">New seller registered</span>
                <span className="text-gray-400">2 min ago</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-gray-600">Product approved</span>
                <span className="text-gray-400">10 min ago</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-gray-600">Seller blocked</span>
                <span className="text-gray-400">1 hr ago</span>
              </li>
            </ul>
          </div>
          <div className="flex gap-6 items-center ">
               <button className="px-2 rounded h-10 bg-green-400 ">View Users</button>
               <button className="px-2 rounded h-10 bg-orange-400 ">View Products </button>
               <button className="px-2 rounded h-10 bg-orange-400 ">View Orders </button>
          </div>

        </div>

      </div>

      {/* Recent Sellers Table */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-orange-600 mb-4">
          Recent Sellers
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-green-600">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="px-4 py-3">Ram Bahadur</td>
                <td className="px-4 py-3">Kathmandu</td>
                <td className="px-4 py-3 text-green-600">Active</td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:underline">
                    View
                  </button>
                </td>
              </tr>

              <tr className="border-b">
                <td className="px-4 py-3">Sita Devi</td>
                <td className="px-4 py-3">Pokhara</td>
                <td className="px-4 py-3 text-yellow-600">Pending</td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:underline">
                    View
                  </button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashBoard;
