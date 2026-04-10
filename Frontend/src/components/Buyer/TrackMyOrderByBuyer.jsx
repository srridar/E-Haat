import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  ArrowLeft,
  CreditCard
} from "lucide-react";
import { BUYER_API_END_POINT } from "@/utils/constants";

const TrackMyOrderByBuyer = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${BUYER_API_END_POINT}/get-order/${orderId}`, {
        withCredentials: true
      });
      if (res.data.success) setOrder(res.data.order);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  const steps = ["pending", "accepted", "picked", "delivered"];
  const getStepStatus = (step) => {
    const currentIndex = steps.indexOf(order?.status);
    const stepIndex = steps.indexOf(step);
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "upcoming";
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!order) return <div className="text-center mt-20">Order not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => window.history.back()}><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Order #{order.orderId.slice(-6)}</h1>
      </div>

      {/* Timeline */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-gray-800">Order Journey</h2>
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            In Progress
          </span>
        </div>
        <div className="relative flex justify-between">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 -z-0" />
          {steps.map((step, i) => {
            const status = getStepStatus(step);
            const isCompleted = status === "completed";
            const isActive = status === "active";
            return (
              <div key={i} className="relative z-10 flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-4
                  ${isCompleted ? "bg-green-500 border-green-100 scale-110" :
                    isActive ? "bg-white border-blue-500 text-blue-600 shadow-lg shadow-blue-100" :
                      "bg-gray-50 border-gray-100 text-gray-400"}`}>
                  {isCompleted ? <CheckCircle2 size={20} className="text-white" /> :
                    <span className={`text-sm font-bold ${isActive ? "text-blue-600" : "text-gray-400"}`}>{i + 1}</span>}
                </div>
                <div className="mt-4 text-center">
                  <p className={`text-sm font-bold capitalize transition-colors duration-200
                    ${isActive ? "text-blue-600" : isCompleted ? "text-gray-800" : "text-gray-400"}`}>{step}</p>
                  {isActive && <p className="text-[10px] text-blue-400 font-medium uppercase tracking-wider animate-pulse">Current</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Products */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="font-bold">Products</h2>
        {order.products.map((p) => (
          <div key={p.productId} className="flex justify-between border p-3 rounded-lg">
            <div>
              <h3 className="font-bold">{p.productName}</h3>
              <p className="text-xs text-gray-400">Seller: {p.seller?.name}</p>
            </div>
            <div>Rs. {p.totalPrice} ({p.quantity})</div>
          </div>
        ))}
      </div>

      {/* Transport */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold mb-2">Transport</h2>
        <p><Truck className="inline" /> {order.transporter?.name}</p>
        <p><Phone className="inline" /> {order.transporter?.phone}</p>
      </div>

      {/* Locations */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold mb-2">Locations</h2>
        <p>Pickup: {order.pickupLocation?.municipality}, Ward {order.pickupLocation?.ward}</p>
        <p>Destination: {order.destinationLocation?.municipality}, Ward {order.destinationLocation?.ward}</p>
      </div>

      {/* Payment */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold">Payment</h2>
        <p>Delivery: Rs. {order.deliveryCost}</p>
        <p className="font-bold text-lg">Total: Rs. {order.totalCost}</p>
      </div>

      {/* Rate Service Button if delivered */}
      {order.status === "delivered" && (
        <div className="text-center">
          <button
            onClick={() => navigate(`/buyer/rate-order/${order.orderId}`)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
          >
            Rate Your Service
          </button>
        </div>
      )}

    </div>
  );
};

export default TrackMyOrderByBuyer;