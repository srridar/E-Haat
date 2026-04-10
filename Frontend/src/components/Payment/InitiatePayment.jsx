import React, { useState, useEffect } from "react";
import { handeleKhaltiapi } from "@/api/server";
import { useParams } from "react-router-dom";
import { BUYER_API_END_POINT } from "@/utils/constants";
import axios from "axios";
import { CheckCircle2, Clock } from "lucide-react";

const InitiatePayment = () => {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const CLIENT = import.meta.env.VITE_URL || "http://localhost:5173";

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${BUYER_API_END_POINT}/get-order/${orderId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const handlePayment = async () => {
    if ((order?.totalCost || 0) < 10) {
      alert("Minimum payment amount is Rs. 10");
      return;
    }

    try {
      setPaying(true);
      const data = await handeleKhaltiapi({
        return_url: `${CLIENT}/payment/complete?orderId=${orderId}&status=Completed`,
        website_url: `${CLIENT}`,
        amount: order.totalCost,
        purchase_order_id: orderId,
        purchase_order_name: "Order Payment",
        customer_info: {
          name: order?.buyer?.name || "Customer",
          email: order?.buyer?.email || "test@example.com",
          phone: order?.buyer?.phone || "9800000000",
        },
      });

      if (data.payment_url) window.location.href = data.payment_url;
      else {
        alert(data.detail || "Payment initiation failed");
        setPaying(false);
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed");
      setPaying(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium">
        Loading your order...
      </div>
    );

  if (!order)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        Order not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6 pt-16">
      <div className="absolute top-64 z-20 w-full h-28 bg-[#4b2870] -skew-y-6"></div>
      <div className="w-full max-w-4xl z-50 bg-white rounded-2xl shadow-xl overflow-hidden relative">
        <div className="p-6 border-b  bg-[#4b2870] text-white">
          <h2 className="text-2xl font-bold">Payment Summary</h2>
          <p className="text-sm mt-1">Complete your payment securely</p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6 p-6">

          {/* LEFT: Order & Buyer Info */}
          <div className="space-y-6">

            {/* Order Info */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm shadow-sm">
              <p>
                <span className="font-semibold">Order ID:</span> {order.orderId}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Buyer Info */}
            <div className="bg-gray-50 p-4 rounded-xl text-sm shadow-sm">
              <p className="font-semibold mb-1">Buyer Info</p>
              <p>{order.buyer?.name || "N/A"}</p>
              <p className="text-gray-500 text-xs">{order.buyer?.email}</p>
              <p className="text-gray-500 text-xs">{order.buyer?.phone}</p>
            </div>

            {/* Transporter Info */}
            <div className="bg-gray-50 p-4 rounded-xl text-sm shadow-sm">
              <p className="font-semibold mb-1">Transporter Info</p>
              <p>Name: {order.transporter.name}</p>
              <p>Phone: {order.transporter.phone}</p>

              {/* Vehicle info */}
              {order.transporter.vehicle && (
                <p>
                  Vehicle: {order.transporter.vehicle.type} -{" "}
                  {order.transporter.vehicle.numberPlate} (
                  {order.transporter.vehicle.capacityKg} Kg)
                </p>
              )}
            </div>

          </div>

          {/* RIGHT: Products & Payment */}
          <div className="flex flex-col justify-between">

            {/* Product List */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Products</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {order.products?.map((item, idx) => (
                  <div
                    key={idx}
                    className="border rounded-xl p-3 flex justify-between items-center hover:shadow-sm transition"
                  >
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-gray-500">
                        Rs. {item.productPrice} × {item.quantity}
                      </p>
                      <p className="text-xs text-gray-400">
                        Seller: {item.seller?.shopName || "N/A"}
                      </p>
                    </div>
                    <div className="font-semibold text-gray-700">
                      Rs. {item.totalPrice}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mt-6 border-t pt-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>Rs. {order.totalAmount}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Delivery</span>
                <span>Rs. {order.deliveryCost}</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>Rs. {order.totalCost}</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={paying}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition
                  ${paying
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-800 hover:bg-purple-900 text-white"
                  }`}
              >
                {paying ? "Processing..." : `Pay Rs. ${order.totalCost}`}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InitiatePayment;