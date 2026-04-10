import React, { useState, useEffect } from "react";
import { MapPin, Package, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BUYER_API_END_POINT } from "@/utils/constants";
import { useSelector } from "react-redux";


const CreateOrderByBuyer = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  const { items, totalAmount } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  
  useEffect(() => {
    const getTransportRequest = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${BUYER_API_END_POINT}/get-transport-req/${id}`, { withCredentials: true } );

        if (res.data.success) {
          setRequest(res.data.request);
          console.log("Fetched Request:", res.data.request); 
        }
      } catch (err) {
        console.error("Error fetching request:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) getTransportRequest();
  }, [id]);



  const handleCreateOrder = async () => {
    try {
      if (!request || items.length === 0) return;

      const formattedProducts = items.map((item) => ({
        product: item.productId,
        seller: item.sellerId,
        quantity: item.quantity,
      }));

      const res = await axios.post(
        `${BUYER_API_END_POINT}/make-order`,
        {
          transporter: request?.transporter?._id,
          products: formattedProducts,
          totalAmount,
          deliveryCost: request?.offeredPrice,
          totalCost: totalAmount + request?.offeredPrice,
          deliveryLocation: {
            pickupLocation: request?.pickupLocation,
            destinationLocation: request?.destinationLocation,
          },
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        // dispatch(clearCart()); 
        setRequest(null);
        navigate("/buyer/all-orders");
      }

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 text-lg font-semibold italic text-blue-600">Loading Request details...</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row relative">
      <div className="absolute top-4 left-4 z-10">
        <button onClick={() => navigate(-1)} className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-md hover:bg-orange-100 transition-colors text-orange-600">
          <ArrowLeft size={20} />
        </button>
      </div>
      <div className="md:w-2/6 bg-slate-900 p-8 text-white">
        <div className="mt-8 mb-8">

          <h2 className="text-2xl font-bold mt-2 mb-2">
            <span className="text-orange-500 italic"> Chosed Transporter is </span> {request?.transporter?.name}
          </h2>
          <p className="text-gray-400 text-sm">Review the details befor creating order .</p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4 items-center">
            <div className="bg-slate-800 p-3 rounded-lg"><MapPin className="text-blue-400 w-5 h-5" /></div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Base Rate</p>
              <p className="text-lg font-mono text-blue-100">NRP {request?.transporter?.pricePerKm || "0"}/km</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="bg-slate-800 p-3 rounded-lg"><Package className="text-orange-400 w-5 h-5" /></div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Vehicle Capacity</p>
              <p className="text-lg font-mono text-orange-100">{request?.transporter?.vehicle?.capacityKg || "0"} Kg</p>
            </div>
          </div>
        </div>

        <div className="mt-12 p-5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700">
          <p className="text-xs text-gray-400 uppercase font-bold mb-3 italic underline">Trust & Safety</p>
          <p className="text-sm text-gray-300 leading-relaxed">
            Payments are held in secure escrow. Funds are only released to the transporter after you confirm successful delivery.
          </p>
        </div>
      </div>


      <div className="md:w-2/3 p-4 md:p-12 bg-gray-50/50">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm">Pickup Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Province</label>
                <input name="pickupLocation.province" value={request?.pickupLocation?.province} placeholder="e.g. Lumbini" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">District</label>
                <input name="pickupLocation.district" value={request?.pickupLocation?.district} placeholder="e.g. Rupandehi" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Municipality</label>
                <input name="pickupLocation.municipality" value={request?.pickupLocation?.municipality} placeholder="e.g. Butwal" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Ward No.</label>
                <input name="pickupLocation.ward" value={request?.pickupLocation?.ward} placeholder="e.g. 11" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>
              <div className="lg:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Tol / Landmark</label>
                <input name="pickupLocation.landmark" value={request?.pickupLocation?.landmark} placeholder="e.g. Near Kalika School" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              </div>
            </div>
          </div>


          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <MapPin className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm">Destination Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Province</label>
                <input name="destinationLocation.province" value={request?.destinationLocation?.province} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">District</label>
                <input name="destinationLocation.district" value={request?.destinationLocation?.district} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Municipality</label>
                <input name="destinationLocation.municipality" value={request?.destinationLocation?.municipality} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Ward No.</label>
                <input name="destinationLocation.ward" value={request?.destinationLocation?.ward} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" />
              </div>
              <div className="lg:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Tol / Landmark</label>
                <input name="destinationLocation.landmark" value={request?.destinationLocation?.landmark} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Item Description</label>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm border-b pb-2">
                  Order Products
                </h3>

                {items.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">
                    No products in cart
                  </p>
                ) : (
                  <>
                    {items.map((item) => {
                      const itemTotal = item.price * item.quantity;
                      return (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <div>
                            <p className="font-semibold text-gray-700"> {item.name} </p>
                            <p className="text-xs text-gray-500">  Rs {item.price} × {item.quantity} </p>
                          </div>

                          <p className="font-bold text-blue-600">
                            Rs {itemTotal}
                          </p>
                        </div>
                      );
                    })}

                    <div className="flex justify-between pt-3 border-t">
                      <span className="font-bold text-gray-700">
                        Products Total:
                      </span>
                      <span className="font-bold text-green-600">
                        Rs {totalAmount}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Delivery Cost</label>
                <input
                  type="number"
                  name="deliveryCost"
                  value={request?.offeredPrice}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Total Cost</label>
                <div className="relative">
                  <input
                    type="number"
                    name="totalCost"
                    value={request?.offeredPrice + totalAmount}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={() => navigate(`/order-tracking/${request?._id}`)}
              disabled={items.length === 0}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              view on map
            </button>
          </div>

        {request?.status === "pending" ? " " :
          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={handleCreateOrder}
              disabled={items.length === 0}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Create Final Order
            </button>
          </div>
        }

      </div>
    </div>
  );
};

export default CreateOrderByBuyer;