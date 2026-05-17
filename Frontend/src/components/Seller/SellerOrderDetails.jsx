import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Package,
  Truck,
  MapPin,
  Clock,
  Upload,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronLeft,
  AlertCircle,
  FileImage,
  Layers,
  HelpCircle,
  DollarSign
} from "lucide-react";
import { SELLER_API_END_POINT } from "@/utils/constants";

const SellerOrderDetails = () => {
  const { sellerOrderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${SELLER_API_END_POINT}/order-details/${sellerOrderId}`, { withCredentials: true });
      setOrder(res.data.sellerOrder);
    } catch (err) {
      console.error("Failed fetching order details:", err);
    } finally {
      setLoading(false);
      setActionLoading(false);
    }
  };


  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const previews = selectedFiles.map(file => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  useEffect(() => {
    fetchOrder();
  }, [sellerOrderId]);


  useEffect(() => {
    return () => {
      filePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  const handleAction = async (apiCall) => {
    setActionLoading(true);
    try {
      await apiCall();
      await fetchOrder(); // Re-fetch naturally triggers UI update
    } catch (err) {
      console.error("Action handler execution crashed:", err);
      setActionLoading(false);
    }
  };


  const acceptOrder = () => handleAction(() =>
    axios.patch(`${SELLER_API_END_POINT}/order/${sellerOrderId}/accept`, {}, { withCredentials: true })
  );

  const rejectOrder = () => handleAction(() =>
    axios.patch(`${SELLER_API_END_POINT}/order/${sellerOrderId}/reject`, {}, { withCredentials: true })
  );

  const markPreparing = () => handleAction(() =>
    axios.patch(`${SELLER_API_END_POINT}/order/${sellerOrderId}/markpreparing`, {}, { withCredentials: true })
  );

  const markReady = () => handleAction(() =>
    axios.patch(`${SELLER_API_END_POINT}/order/${sellerOrderId}/markreadyforpickup`, {}, { withCredentials: true })
  );


  const uploadProof = async () => {
    if (files.length === 0) return;
    setActionLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      await axios.post(
        `${SELLER_API_END_POINT}/order/${sellerOrderId}/upload-proof`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      setFiles([]);
      setFilePreviews([]);
      fetchOrder();
    } catch (err) {
      console.error("Proof image loading attachment pipeline failure:", err);
      setActionLoading(false);
    }
  };


  const statusStyles = {
    pending: { label: "Pending Setup", bg: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
    accepted: { label: "Accepted", bg: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
    preparing: { label: "In Preparation", bg: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
    ready_for_pickup: { label: "Ready for Pickup", bg: "bg-indigo-50 text-indigo-700 border-indigo-200", dot: "bg-indigo-500" },
    picked_up: { label: "Picked Up", bg: "bg-cyan-50 text-cyan-700 border-cyan-200", dot: "bg-cyan-500" },
    delivered: { label: "Completed & Delivered", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    rejected: { label: "Rejected / Cancelled", bg: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col gap-3 items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-indigo-600" size={36} />
        <span className="text-xs font-semibold text-slate-500">Loading Order Ledger...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center shadow-sm max-w-sm">
          <AlertCircle className="text-rose-500 mx-auto mb-3" size={40} />
          <h3 className="text-lg font-bold text-slate-800">Order Missing</h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">The order payload requested could not be resolved by the database engine identifier.</p>
          <button onClick={() => navigate(-1)} className="text-xs bg-slate-900 text-white font-bold px-4 py-2 rounded-xl">Go Back</button>
        </div>
      </div>
    );
  }

  const activeStyle = statusStyles[order.status] || statusStyles.pending;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">


        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft size={18} /> Back to Dashboard
          </button>
          {actionLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
              <Loader2 className="animate-spin" size={12} /> Synchronizing Node
            </div>
          )}
        </div>


        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Order <span className="font-mono text-indigo-600">#{order._id?.slice(-8).toUpperCase()}</span>
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${activeStyle.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${activeStyle.dot}`} />
                {activeStyle.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Registered Transaction Reference Node: {order._id}
            </p>
          </div>

          {order.status !== "delivered" && order.status !== "rejected" && (
            <div className="flex flex-wrap gap-2 w-full md:w-auto">

              {order.status === "pending" && (
                <>
                  <button
                    onClick={rejectOrder}
                    disabled={actionLoading}
                    className="flex-1 md:flex-none px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-all"
                  >
                    Reject Order
                  </button>
                  <button
                    onClick={acceptOrder}
                    disabled={actionLoading}
                    className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/10"
                  >
                    Accept Order
                  </button>
                </>
              )}

              {order.status === "accepted" && (
                <button
                  onClick={markPreparing}
                  disabled={actionLoading}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-500/10"
                >
                  Start Preparing
                </button>
              )}

              {order.status === "preparing" && (
                <button
                  onClick={markReady}
                  disabled={actionLoading}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10"
                >
                  Set PickUp Ready
                </button>
              )}
            </div>
          )}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
                <Package className="text-indigo-500" size={18} /> Manifest Products
              </h2>

              <div className="divide-y divide-slate-100">
                {order.products?.map((p, i) => (
                  <div key={i} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0 group">
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                        {p.product?.name || "Premium Item Entry"}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Unit Valuation Base Rate: Rs. {p.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mr-3">
                        x{p.quantity}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        Rs. {(p.quantity * p.price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>


              <div className="bg-slate-50 rounded-2xl p-4 mt-4 flex items-center justify-between border border-slate-100/70">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <DollarSign size={14} className="text-slate-400" /> Net Subtotal Valuation
                </span>
                <span className="text-lg font-black text-slate-900">
                  Rs. {order.products?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
                <Upload className="text-indigo-500" size={18} /> Consignment Packaging Verification
              </h2>

              {order.status !== "delivered" && order.status !== "rejected" && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                  <div className="sm:col-span-3 relative border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 rounded-2xl h-24 flex items-center justify-center transition-all group overflow-hidden">
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-1">
                      <FileImage size={20} className="text-slate-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-slate-600">Select Proof Files</span>
                      <span className="text-[10px] text-slate-400">JPG, PNG attachments support max 4MB</span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  <button
                    onClick={uploadProof}
                    disabled={files.length === 0 || actionLoading}
                    className="w-full h-12 bg-slate-900 disabled:bg-slate-100 hover:bg-slate-800 text-white disabled:text-slate-400 text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 self-end sm:self-auto"
                  >
                    <Upload size={14} /> Commit Upload
                  </button>
                </div>
              )}

              {filePreviews.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Unsaved Attached Staging Previews:</h4>
                  <div className="flex gap-2 flex-wrap bg-amber-50/40 p-2 border border-amber-100 rounded-xl">
                    {filePreviews.map((previewUrl, i) => (
                      <img key={i} src={previewUrl} alt="staging" className="w-14 h-14 object-cover rounded-lg ring-2 ring-white shadow-sm" />
                    ))}
                  </div>
                </div>
              )}


              <div>
                {order.sellerProofImages?.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400">Secure Vault Storage Proof Blocks</span>
                    <div className="flex gap-3 flex-wrap">
                      {order.sellerProofImages.map((img, i) => (
                        <div key={i} className="relative w-20 h-20 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden group shadow-sm hover:scale-105 transition-transform duration-200">
                          <img src={img.url} alt="proof block asset" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-xs flex items-center justify-center gap-2">
                    <HelpCircle size={14} /> No visual package dispatch proofs committed to this record vault yet.
                  </div>
                )}
              </div>
            </div>

          </div>


          <div className="space-y-6">

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
                <Truck className="text-indigo-500" size={18} /> Logistics & Waybill Routing
              </h2>


              <div className="space-y-4 relative pl-4 border-l-2 border-slate-100 ml-2">
                <div className="relative">
                  <span className="absolute -left-[23px] top-0.5 bg-indigo-50 border border-indigo-200 text-indigo-600 p-0.5 rounded-full z-10">
                    <MapPin size={10} />
                  </span>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pickup Warehouse Hub</div>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{order.pickupLocation?.district || "Primary Warehouse Base"}</p>
                </div>

                <div className="relative pt-2">
                  <span className="absolute -left-[23px] top-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 p-0.5 rounded-full z-10">
                    <Truck size={10} />
                  </span>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery Destination</div>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{order.deliveryLocation?.district || "Customer Destination Node"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
                <Layers className="text-indigo-500" size={18} /> Pipeline Status Validation Flow
              </h2>

              <div className="space-y-3.5">
                {[
                  { key: "pending", label: "Pending", desc: "Awaiting administrative or supplier registry review." },
                  { key: "accepted", label: "Accepted", desc: "Order confirmation committed by seller node." },
                  { key: "preparing", label: "Preparing", desc: "Consignment item sorting and packaging operational phase." },
                  { key: "ready", label: "Ready", desc: "Package sealed, verified, and staging courier arrival." },
                  { key: "pickedup", label: "Picked Up", desc: "Handover complete. In-transit cargo lifecycle active." }
                ].map((step, idx) => {
                  const orderStatuses = ["pending", "accepted", "preparing", "ready", "pickedup", "delivered"];
                  const currentIdx = orderStatuses.indexOf(order.status);
                  const stepIdx = orderStatuses.indexOf(step.key);
                  const isPassed = currentIdx >= stepIdx && order.status !== "rejected";

                  return (
                    <div key={idx} className="flex gap-3 items-start group">
                      <div className="mt-0.5 shrink-0">
                        {isPassed ? (
                          <CheckCircle2 size={16} className="text-indigo-600" />
                        ) : (
                          <Clock size={16} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`text-xs font-bold ${isPassed ? "text-slate-800" : "text-slate-400"}`}>
                          {step.label}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default SellerOrderDetails;