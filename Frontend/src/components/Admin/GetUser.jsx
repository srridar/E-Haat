import React from "react";

const GetUser = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    User Details
                </h1>
                <p className="text-gray-500 mt-1">
                    View and manage user account information
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Profile */}
                <div className="lg:col-span-1 border-r pr-6">

                    <div className="flex flex-col items-center text-center">
                        <div className="h-28 w-28 rounded-full bg-gray-200 mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Ram Bahadur
                        </h2>
                        <p className="text-gray-500">Seller</p>

                        <span className="mt-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm">
                            Active
                        </span>
                    </div>

                    {/* Admin Actions */}
                    <div className="mt-12 flex gap-4">
                        <button className="px-3 bg-green-500 hover:bg-green-700 text-white py-2 rounded-lg">
                            Approve User
                        </button>
                        <button className="px-3 bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg">
                            Verify Account
                        </button>
                        <button className="px-3 bg-red-500 hover:bg-red-700 text-white py-2 rounded-lg">
                            Block User
                        </button>
                    </div>
                </div>

                {/* Right: User Info */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Contact Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><span className="font-medium">Email:</span> ram@gmail.com</p>
                            <p><span className="font-medium">Phone:</span> +977 9800000000</p>
                            <p><span className="font-medium">City:</span> Kathmandu</p>
                            <p><span className="font-medium">Address:</span> Baneshwor</p>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Account Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><span className="font-medium">User ID:</span> #USR1023</p>
                            <p><span className="font-medium">Joined On:</span> 12 Jan 2025</p>
                            <p><span className="font-medium">Verification:</span>
                                <span className="text-yellow-600 ml-2">Pending</span>
                            </p>
                            <p><span className="font-medium">Last Login:</span> 2 hours ago</p>
                        </div>
                    </div>

                    {/* Location Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Location Information
                        </h3>

                        <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            Map / Location Preview
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Admin Notes
                        </h3>

                        <textarea
                            placeholder="Add internal notes about this user..."
                            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                            rows={3}
                        ></textarea>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GetUser;
