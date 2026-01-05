import React from "react";

const ReportAdmin = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Reports & Complaints
        </h1>
        <p className="text-gray-500 mt-1">
          Review user reports and take administrative actions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Total Reports</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">342</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Pending</p>
          <h2 className="text-3xl font-bold text-yellow-600 mt-2">86</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Resolved</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">224</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Critical</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">32</h2>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

        <input
          type="text"
          placeholder="Search by user, report ID, or subject"
          className="w-full md:w-1/3 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <select className="w-full md:w-1/4 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
          <option>All Categories</option>
          <option>Fraud</option>
          <option>Fake Products</option>
          <option>Harassment</option>
          <option>Payment Issues</option>
        </select>

        <select className="w-full md:w-1/4 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
          <option>All Status</option>
          <option>Pending</option>
          <option>Resolved</option>
          <option>Dismissed</option>
        </select>

      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3">Report ID</th>
              <th className="px-4 py-3">Reported By</th>
              <th className="px-4 py-3">Against</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3">#RPT2031</td>
              <td className="px-4 py-3">Hotel Annapurna</td>
              <td className="px-4 py-3">Ram Bahadur</td>
              <td className="px-4 py-3">Fake Product</td>
              <td className="px-4 py-3">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                  High
                </span>
              </td>
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
                  Resolve
                </button>
                <button className="text-red-600 hover:underline">
                  Block User
                </button>
              </td>
            </tr>

            <tr className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3">#RPT2032</td>
              <td className="px-4 py-3">Everest Traders</td>
              <td className="px-4 py-3">Sita Devi</td>
              <td className="px-4 py-3">Payment Issue</td>
              <td className="px-4 py-3">
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                  Medium
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  Resolved
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

export default ReportAdmin;
