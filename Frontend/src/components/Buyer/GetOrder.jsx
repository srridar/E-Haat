import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import {  Package, Truck, CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import { BUYER_API_END_POINT } from "@/utils/constants";

const OrderSuccessTracking = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams(); 

  const steps = ["Pending", "Shipped", "Delivered"];
  const getStepIndex = (status) => steps.indexOf(status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase());

  useEffect(() => {
    const fetchCurrentOrder = async () => {
      try {
        const res = await axios.get(`${BUYER_API_END_POINT}/track-order/${id}`, { withCredentials: true });
        if (res.data.success) {
          setOrder(res.data.order);
          console.log(res.data.order);
        }
      } catch (error) {
        console.error("Order fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentOrder();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center animate-pulse text-emerald-600 font-bold">Initializing Tracker...</div>;
  if (!order) return <div className="text-center py-20">Order not found.</div>;

  const currentStep = getStepIndex(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mb-2 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Order Confirmed!</h1>
        <p className="text-slate-500 mt-1">Hurray! Your order <span className="text-emerald-600 font-bold">#{order.orderId.slice(-8)}</span> has been placed successfully.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-xl shadow-slate-100 mb-4">
        <div className="relative flex justify-between items-center mb-2">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-1000" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, idx) => (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors duration-500 
                ${idx <= currentStep ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                {idx < currentStep ? <CheckCircle2 size={20} /> : <span className="text-xs font-bold">{idx + 1}</span>}
              </div>
              <span className={`mt-3 text-xs font-black uppercase tracking-tighter ${idx <= currentStep ? 'text-emerald-600' : 'text-slate-400'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* 3. Delivery Details Card */}
        <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-black text-slate-800 uppercase text-sm tracking-widest">
              <MapPin size={18} className="text-emerald-500" /> Shipping Address
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="font-bold text-slate-700">{order?.shippingDetails?.destinationLocation?.province}</p>
              <p className="text-sm  text-slate-500">{order?.shippingDetails?.destinationLocation?.district}</p>
              <p className="text-sm text-slate-500">{order?.shippingDetails?.destinationLocation?.municipality}</p>
              <p className="text-sm text-slate-500">{order?.shippingDetails?.destinationLocation?.ward}</p>
              <p className="text-sm text-slate-500">{order?.shippingDetails?.destinationLocation?.landmark}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-black text-slate-800 uppercase text-sm tracking-widest">
              <Truck size={18} className="text-emerald-500" /> Estimated Delivery
            </h3>
            <div className="bg-emerald-50 p-4 rounded-2xl">
              <p className="font-bold text-emerald-700">Expected by Tomorrow</p>
              <p className="text-sm text-emerald-600/70">Our delivery hero is on the way!</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Order Summary Small Card */}
      <div className="bg-slate-900 text-white rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            <Package size={32} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Product</p>
            <h4 className="text-lg font-bold">{order.productName}</h4>
            <p className="text-emerald-400 font-black">Rs. {order.totalPrice}</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/product/all')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => navigate('/buyer/all-orders')}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            All Orders <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessTracking;