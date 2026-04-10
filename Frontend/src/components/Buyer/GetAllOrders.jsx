import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {
  Package,
  Truck,
  ShoppingBag,
  ChevronRight,
  Star,
  ArrowRight
} from "lucide-react";

import { BUYER_API_END_POINT } from "@/utils/constants";

const GetAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchMyOrders = async () => {
    try {
      const res = await axios.get(
        `${BUYER_API_END_POINT}/get-all-orders`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setOrders(res.data.orders);
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

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();

    if (s === 'delivered') return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (s === 'accepted') return "bg-blue-100 text-blue-700 border-blue-200";
    if (s === 'pending') return "bg-amber-100 text-amber-700 border-amber-200";
    if (s === 'picked') return "bg-purple-100 text-purple-700 border-purple-200";

    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-40 w-full bg-slate-100 animate-pulse rounded-3xl" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
          <ShoppingBag size={48} />
        </div>

        <h2 className="text-2xl font-black text-slate-800">No orders yet</h2>

        <button
          onClick={() => navigate("/product/all")}
          className="mt-6 px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-black text-slate-900">Order History</h1>

        <div className="bg-emerald-50 px-4 py-2 rounded-2xl">
          <span className="text-emerald-700 font-bold text-sm">
            {orders.length} Orders
          </span>
        </div>
      </header>

      <div className="space-y-8">
        {orders.map((order) => {
          const status = order.status?.toLowerCase();

          const isTrackable =
            order.isPaymentCompleted &&
            ['accepted', 'picked', 'delivered'].includes(status);

          return (
            <div
              key={order.orderId}
              className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition p-6 border"
            >

              {/* Order Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-bold text-slate-800">
                    #{order.orderId.slice(-8)}
                  </p>
                </div>

                <div className={`px-4 py-2 rounded-xl text-xs font-bold ${getStatusStyles(order.status)}`}>
                  {order.status}
                </div>
              </div>

              {/* Products */}
              <div className="space-y-4">
                {order.products.map((product) => (
                  <div
                    key={product.productId}
                    onClick={() => navigate(`/buyer/order-tracking/${order.orderId}`)}
                    className="group border rounded-2xl p-4 hover:bg-slate-50 transition cursor-pointer"
                  >

                    <div className="flex justify-between items-center">

                      {/* Left */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                          <Package size={20} />
                        </div>

                        <div>
                          <h2 className="font-bold text-slate-800 group-hover:text-emerald-600">
                            {product.productName}
                          </h2>

                          <p className="text-xs text-slate-400">
                            Seller: {product.seller?.name}
                          </p>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">
                          Rs. {product.totalPrice}
                        </p>

                        <p className="text-xs text-gray-400">
                          {product.quantity} units
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs">
                        Unit: Rs. {product.productPrice}
                      </span>

                      <ChevronRight size={16} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <p className="font-bold text-orange-500 mt-4">
                Transport: Rs. {order.deliveryCost} | Total: Rs. {order.totalAmount}
              </p>

              {/* Footer */}
              <div className="mt-6 flex justify-between items-center">

                <div className="flex gap-4">
                  <div className={`px-3 py-1 rounded-lg text-xs font-bold border 
                    ${order.isSellerRated ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                    <Star size={12} /> Seller
                  </div>

                  <div className={`px-3 py-1 rounded-lg text-xs font-bold border 
                    ${order.isTransporterRated ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                    <Truck size={12} /> Transport
                  </div>
                </div>

                {/* ✅ FINAL BUTTON LOGIC */}
                {isTrackable ? (
                  <button
                    onClick={() => navigate(`/buyer/order-tracking/${order.orderId}`)}
                    className="text-sm font-bold text-indigo-600"
                  >
                    Track your Order
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/payment/initiate/${order.orderId}`)}
                    className="text-sm font-bold text-indigo-600"
                  >
                    Proceed to payment
                    <ArrowRight size={16} className="inline-block ml-1" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GetAllOrders;