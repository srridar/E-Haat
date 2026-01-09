import React, { useEffect, useState } from "react";
import axios from "axios";

const GetAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/order/buyer/my-orders",
        { withCredentials: true }
      );

      if (res.data.success) {
        setOrders(res.data.orderedProducts);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        You have not ordered any products yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="grid gap-6">
        {orders.map((item, index) => (
          <div
            key={index}
            className="border rounded-xl p-5 shadow-sm bg-white"
          >
            {/* Product Info */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {item.productName}
              </h2>
              <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {item.orderStatus}
              </span>
            </div>

            {/* Price Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <p>
                <span className="font-medium">Price:</span> Rs.{" "}
                {item.productPrice}
              </p>
              <p>
                <span className="font-medium">Quantity:</span> {item.quantity}
              </p>
              <p>
                <span className="font-medium">Total:</span> Rs.{" "}
                {item.totalPrice}
              </p>
              <p>
                <span className="font-medium">Order ID:</span>{" "}
                {item.orderId.slice(-6)}
              </p>
            </div>

            {/* Seller Info */}
            <div className="mt-4 p-3 rounded-lg bg-gray-50 text-sm">
              <h3 className="font-semibold mb-1">Seller Details</h3>
              <p>Name: {item.seller?.name}</p>
              <p>Email: {item.seller?.email}</p>
              <p>Phone: {item.seller?.phone}</p>
            </div>

            {/* Ratings Status */}
            <div className="flex gap-4 mt-4 text-sm">
              <span
                className={`px-3 py-1 rounded-full ${item.isSellerRated
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                  }`}
              >
                Seller Rated: {item.isSellerRated ? "Yes" : "No"}
              </span>

              <span
                className={`px-3 py-1 rounded-full ${item.isTransportRated
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                  }`}
              >
                Transport Rated: {item.isTransportRated ? "Yes" : "No"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetAllOrders;
