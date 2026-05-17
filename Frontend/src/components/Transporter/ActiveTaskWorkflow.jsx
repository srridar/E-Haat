import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Package,
  Truck,
  Clock,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  UploadCloud,
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  FileText
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TRANSPORTER_API_END_POINT} from '@/utils/constants';

const ConfirmedPickupTaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [pickupOtp, setPickupOtp] = useState("");
  const [deliveryOtp, setDeliveryOtp] = useState("");

  const [deliveryProofs, setDeliveryProofs] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchTask = async () => {
    try {
      const res = await axios.get(`${TRANSPORTER_API_END_POINT}/conformed-order-task/${taskId}`, { withCredentials: true });
      if(res.data?.success) setTask(res.data.task);
       
    } catch (error) {
      console.error(error);
      toast.error("Failed to sync operational metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const runWithFeedback = async (actionCallback) => {
    if (actionLoading) return;
    setActionLoading(true);
    await actionCallback();
    setActionLoading(false);
  };

  const handleVerifyPickup = () => {
    if (!pickupOtp) return toast.warning("Provide pickup auth security OTP");
    runWithFeedback(async () => {
      try {
        const res = await axios.put(
          `${TRANSPORTER_API_END_POINT}/pickup-task/${task.sellerOrder._id}/verify`,
          { otp: pickupOtp },
          { withCredentials: true }
        );
        toast.success(res.data.message || "Pickup Authenticated");
        setPickupOtp("");
        await fetchTask();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Pickup validation rejected");
      }
    });
  };

  const handleStatusTransition = (endpoint, contextLabel) => {
    runWithFeedback(async () => {
      try {
        const res = await axios.patch(
          `${TRANSPORTER_API_END_POINT}/pickup-task/${task.sellerOrder._id}/${endpoint}`,
          {},
          { withCredentials: true }
        );
        toast.success(res.data.message || `${contextLabel} updated`);
        await fetchTask();
      } catch (error) {
        toast.error(error?.response?.data?.message || `Failed to transition to ${contextLabel}`);
      }
    });
  };

  const handleUploadProof = async () => {
    if (deliveryProofs.length === 0) return toast.warning("Staged document storage array is empty");
    try {
      setUploading(true);
      const formData = new FormData();
      for (let file of deliveryProofs) {
        formData.append("images", file);
      }

      const res = await axios.post(`${TRANSPORTER_API_END_POINT}/pickup-task/${task.sellerOrder._id}/upload-proof`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(res.data.message || "Visual manifest saved");
      setDeliveryProofs([]);
      await fetchTask();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Multipart compilation stream aborted");
    } finally {
      setUploading(false);
    }
  };

  const handleCompleteDelivery = () => {
    if (!deliveryOtp) return toast.warning("Delivery verification token required");
    runWithFeedback(async () => {
      try {
        const res = await axios.patch(
          `${TRANSPORTER_API_END_POINT}/pickup-task/${task.sellerOrder._id}/complete`,
          { otp: deliveryOtp },
          { withCredentials: true }
        );
        toast.success(res.data.message || "Handshake complete. Ledger finalized");
        setDeliveryOtp("");
        await fetchTask();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Invalid terminal verification credentials");
      }
    });
  };


  const getStatusStyle = (status) => {
    const maps = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      ready_for_pickup: "bg-blue-50 text-blue-700 border-blue-200",
      picked_up: "bg-sky-50 text-sky-700 border-sky-200",
      in_transit: "bg-indigo-50 text-indigo-700 border-indigo-200",
      out_for_delivery: "bg-orange-50 text-orange-700 border-orange-200",
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    return maps[status] || "bg-slate-50 text-slate-700 border-slate-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6">
        <Loader2 className="animate-spin text-slate-800 w-12 h-12 mb-4 stroke-[1.5]" />
        <p className="text-slate-500 font-medium tracking-wide text-sm animate-pulse">Syncing Cryptographic Supply Pipeline...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
          <p className="text-slate-800 font-semibold text-lg mb-2">Manifest Node Unreachable</p>
          <p className="text-slate-500 text-sm mb-6">The task parameters requested do not populate valid state models inside the cluster.</p>
          <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold tracking-wide shadow-sm hover:bg-slate-800 transition">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const order = task.sellerOrder;

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 antialiased font-sans pb-16">
      
      {/* GLOBAL BANNER BACKGROUND CONTEXT */}
      <div className="h-44 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 w-full absolute top-0 left-0 z-0 border-b border-slate-800/40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10 space-y-6">
        
        {/* TOP ACCESSIBILITY ACTIONS */}
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10"
        >
          <ArrowLeft size={14} /> Back to Route Sheet
        </button>

        {/* CORE CONTEXT MONITOR BAR */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm rounded-3xl p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                <Truck size={20} className="stroke-[1.75]" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Logistics Routing Node
              </h1>
            </div>
            <p className="text-xs font-mono text-slate-400 pl-10">
              UUID: <span className="text-slate-600 font-medium">{order._id}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 block md:hidden">Status Matrix:</span>
            <span className={`px-3.5 py-1.5 text-xs font-bold font-mono tracking-wide rounded-full border shadow-sm uppercase ${getStatusStyle(order.status)}`}>
              {order.status?.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        {/* COMPONENT DIVISION GRID */}
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          
          {/* MAIN COLUMN (LEFT 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* MANIFEST ITEMS MODULE */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="font-bold text-sm tracking-wide text-slate-700 uppercase flex items-center gap-2">
                  <Package size={16} className="text-slate-400" /> Freight Cargo Contents
                </h2>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100">
                  {order.products?.length || 0} Discrete Line Items
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {order.products.map((item) => (
                  <div key={item._id} className="p-5 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-slate-800 text-sm">
                        {item.product?.name || "Unreferenced Cargo Signature"}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>Quantity Allocation:</span>
                        <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {item.quantity} units
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-medium">Financial Liability</p>
                      <p className="font-mono font-bold text-sm text-slate-900 mt-0.5">
                        Rs. {item.subtotal?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SPATIAL ANCHOR POINTS MAP SIMULATION */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-6">
              <h2 className="font-bold text-sm tracking-wide text-slate-700 uppercase flex items-center gap-2">
                <Layers size={16} className="text-slate-400" /> Geographic Routing Path
              </h2>

              <div className="grid md:grid-cols-2 gap-6 relative">
                
                {/* Visual Connector Line for Large Screens */}
                <div className="hidden md:block absolute top-4 left-1/2 w-px bottom-4 bg-dashed border-l border-slate-200" />

                {/* PICKUP FACILITY */}
                <div className="relative group p-4 border border-slate-100 rounded-2xl bg-slate-50/30 hover:bg-white hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-2 font-bold text-xs tracking-wider text-emerald-600 uppercase mb-3">
                    <span className="w-5 h-5 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center font-mono">A</span>
                    Consignor Origin Node
                  </div>
                  <div className="space-y-1.5 text-sm pl-7">
                    <p className="font-bold text-slate-800">{order.pickupLocation?.landmark || "Warehouse Hub"}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {order.pickupLocation?.municipality}, Ward {order.pickupLocation?.ward}, {order.pickupLocation?.district}
                    </p>
                  </div>
                </div>

                {/* DELIVERY TARGET */}
                <div className="relative group p-4 border border-slate-100 rounded-2xl bg-slate-50/30 hover:bg-white hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-2 font-bold text-xs tracking-wider text-rose-600 uppercase mb-3">
                    <span className="w-5 h-5 rounded-md bg-rose-50 border border-rose-200 flex items-center justify-center font-mono">B</span>
                    Consignee Final Dropoff
                  </div>
                  <div className="space-y-1.5 text-sm pl-7">
                    <p className="font-bold text-slate-800">{order.deliveryLocation?.landmark || "Residential Endpoint"}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {order.deliveryLocation?.municipality}, Ward {order.deliveryLocation?.ward}, {order.deliveryLocation?.district}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* AUDIT LOG CHRONOLOGY TIMELINE */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
              <h2 className="font-bold text-sm tracking-wide text-slate-700 uppercase mb-6 flex items-center gap-2">
                <Clock size={16} className="text-slate-400" /> Temporal Verification Stream
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Manifest Bound", field: order.createdAt, badge: "📦" },
                  { label: "Cargo Pickup", field: order.pickedUpAt, badge: "✅" },
                  { label: "In-Transit Lane", field: order.inTransitAt, badge: "🚚" },
                  { label: "Final Signature", field: order.deliveredAt, badge: "🎉" }
                ].map((step, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border transition-all ${step.field ? "bg-white border-slate-200/80" : "bg-slate-50/50 border-slate-100 opacity-60"}`}>
                    <span className="text-lg mb-1 block">{step.badge}</span>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{step.label}</p>
                    <p className="font-mono text-[11px] text-slate-700 font-semibold mt-1 truncate">
                      {step.field ? new Date(step.field).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "STAGED UNRECORDED"}
                    </p>
                    {step.field && (
                      <p className="text-[9px] font-medium text-slate-400 font-mono mt-0.5">
                        {new Date(step.field).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* CONTROL OPERATOR STATION PANEL (RIGHT 1/3) */}
          <div className="space-y-6">
            
            {/* STAGE CHANGE ACTUATOR PLATFORM */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <ShieldCheck size={14} className="text-indigo-500" /> Step Automation Console
              </h3>

              {actionLoading && (
                <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl text-xs font-medium text-indigo-700 flex items-center gap-2 animate-pulse">
                  <Loader2 size={12} className="animate-spin" />
                  <span>Committing dynamic network changes...</span>
                </div>
              )}

              {/* ACTION MODULE 1: AUTHENTICATE ORIGIN HANDOVER */}
              {!order.pickupVerified && (
                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700 uppercase">Secure Pickup Handshake</p>
                    <p className="text-[11px] text-slate-400">Acquire authorization key code from the sorting depot supervisor.</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Pickup OTP Token"
                    maxLength={8}
                    value={pickupOtp}
                    onChange={(e) => setPickupOtp(e.target.value)}
                    className="w-full font-mono text-center tracking-widest text-sm bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-2.5 transition-all outline-none"
                  />
                  <button
                    onClick={handleVerifyPickup}
                    disabled={actionLoading || !pickupOtp}
                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white py-2.5 rounded-xl font-semibold text-xs tracking-wide transition shadow-sm"
                  >
                    Confirm Origin Authentication
                  </button>
                </div>
              )}

              {/* ACTION MODULE 2: ENGAGE IN TRANSIT NETWORK */}
              {order.status === "picked_up" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed">Package verification confirmed. Broadcast telematics status onto live customer notifications array.</p>
                  <button
                    onClick={() => handleStatusTransition("in_transit", "In Transit Lane")}
                    disabled={actionLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-xs tracking-wide transition shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5"
                  >
                    Deploy Into Transit Lanes
                  </button>
                </div>
              )}

              {/* ACTION MODULE 3: INITIALIZE TERMINAL OUTBOUND ROUTE */}
              {order.status === "in_transit" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed">Vehicle arrived at regional distribution hub. Initialize last-mile notification framework.</p>
                  <button
                    onClick={() => handleStatusTransition("out-for-delivery", "Out For Delivery Pipeline")}
                    disabled={actionLoading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold text-xs tracking-wide transition shadow-md shadow-orange-100 flex items-center justify-center gap-1.5"
                  >
                    Dispatch Out For Delivery
                  </button>
                </div>
              )}


              {order.status === "out_for_delivery" && (
                <div className="space-y-4 pt-1">
                  <div className="space-y-3 p-4 bg-purple-50/40 border border-purple-100 rounded-2xl">
                    <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
                      <UploadCloud size={14} /> Chain of Custody Proof
                    </div>
                    <div className="border border-dashed border-purple-200 bg-white rounded-xl p-4 text-center relative hover:bg-purple-50/20 transition-all group">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => setDeliveryProofs([...e.target.files])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <p className="text-xs font-semibold text-purple-600 group-hover:underline">Staging Area Interface</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {deliveryProofs.length > 0 ? `${deliveryProofs.length} image files selected` : "Snap photos of signed physical receipts"}
                      </p>
                    </div>

                    {deliveryProofs.length > 0 && (
                      <button
                        onClick={handleUploadProof}
                        disabled={uploading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        {uploading ? "Streaming to S3 Bucket..." : "Upload Staged Media Assets"}
                      </button>
                    )}
                  </div>

              
                  {order.deliveryProofImages?.length > 0 && (
                    <div className="space-y-3 p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-emerald-800 uppercase">Complete Consignment Node</p>
                        <p className="text-[11px] text-emerald-600/80">Input secure security signature code broadcasted directly to consumer device.</p>
                      </div>
                      <input
                        type="text"
                        placeholder="Customer Verification OTP"
                        value={deliveryOtp}
                        onChange={(e) => setDeliveryOtp(e.target.value)}
                        className="w-full font-mono text-center tracking-widest text-sm bg-white border border-emerald-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-2.5 transition-all outline-none"
                      />
                      <button
                        onClick={handleCompleteDelivery}
                        disabled={actionLoading || !deliveryOtp}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-100 disabled:text-slate-400 text-white py-2.5 rounded-xl font-bold text-xs tracking-wide transition shadow-md shadow-emerald-100"
                      >
                        Execute Terminal Close-Out
                      </button>
                    </div>
                  )}
                </div>
              )}

              
              {order.status === "delivered" && (
                <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl text-center space-y-2">
                  <CheckCircle2 size={32} className="text-emerald-600 mx-auto stroke-[1.5]" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide">Ledger Immutable Entry Closed</p>
                    <p className="text-[11px] text-emerald-700/80 mt-1">This specific payload run is successfully registered inside the production architecture.</p>
                  </div>
                </div>
              )}
            </div>


            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText size={14} /> Pipeline Integrity Logs
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-medium">Origin Acceptance Verification</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${order.pickupVerified ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                    {order.pickupVerified ? "SECURELY_SIGNED" : "PENDING"}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-medium">Visual Metadata Proofs</span>
                  <span className="font-mono font-bold text-slate-700 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-[10px]">
                    {order.deliveryProofImages?.length || 0} Assets Archived
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Terminal Handshake Match</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${order.status === "delivered" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                    {order.status === "delivered" ? "PASSED_CRYPT_CHECK" : "UNRESOLVED"}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmedPickupTaskDetails;