import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Phone,
  User,
  Package,
  Clock,
  Truck,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Hash,
  Layers,
} from "lucide-react";

const TransporterTaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({ accept: false, reject: false });

  useEffect(() => {
    const abortController = new AbortController();

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/transporter/task/${taskId}`, {
          withCredentials: true,
          signal: abortController.signal,
        });
        if (res.data?.success) {
          setTask(res.data.task);
        } else {
          setError("Requested shipment details could not be parsed.");
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("[LOGISTICS ENGINE] Error loading task:", err);
        setError("Failed to synchronize with logistical manifest servers.");
      } finally {
        setLoading(false);
      }
    };

    if (taskId) fetchTask();

    return () => abortController.abort();
  }, [taskId]);

  const handleAction = async (type) => {
    setActionLoading((prev) => ({ ...prev, [type]: true }));
    try {
      // Mock API action implementation placeholder
      // await axios.post(`/api/transporter/task/${taskId}/${type}`, {}, { withCredentials: true });
      alert(`Task successfully ${type}ed!`);
      navigate("/transporter/tasks");
    } catch (err) {
      console.error(`Failed to process ${type} lifecycle action:`, err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="animate-spin w-9 h-9 text-blue-600" />
        <p className="text-sm font-medium text-slate-500 tracking-wide">Retrieving consignment metrics...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-md shadow-sm">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">Manifest Unreadable</h3>
          <p className="text-sm text-slate-500 mb-6">{error || "The requested dispatch profile does not exist."}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition"
          >
            <ArrowLeft size={16} /> Return to Queue
          </button>
        </div>
      </div>
    );
  }

  const order = task.sellerOrder;
  const buyer = order?.buyer;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 lg:p-12 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Action Bar */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition mb-2 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition" />
          Back to Live Feed
        </button>

        {/* Global Dashboard Header */}
        <header className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 hidden sm:block">
              <Truck size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                Transit Dispatch Details
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 w-fit">
                <Hash size={12} />
                <span>TASK-{task._id?.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
              Current Status
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize bg-yellow-50 text-yellow-800 border border-yellow-200">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5 animate-pulse" />
              {task.status || "Pending Claim"}
            </span>
          </div>
        </header>


        <div className="grid lg:grid-cols-3 gap-6">
          
          <main className="lg:col-span-2 space-y-6">
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <Package size={18} className="text-slate-400" />
                Consignment Identity
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs font-medium text-slate-400 block">Associated Order Token</span>
                  <span className="font-mono font-medium text-slate-800">
                    #{order?._id?.toUpperCase() || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-400 block">Manifest Created</span>
                  <div className="flex items-center gap-1.5 text-slate-700 mt-0.5">
                    <Clock size={14} className="text-slate-400" />
                    <span>{task.createdAt ? new Date(task.createdAt).toLocaleString() : "---"}</span>
                  </div>
                </div>
              </div>

              {task.expiresAt && (
                <div className="flex items-center gap-2.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-100 p-3 rounded-xl mt-2">
                  <AlertTriangle size={16} className="text-rose-500 shrink-0" />
                  <span>
                    Claim Window Limitation: This route will auto-expire if unassigned by{" "}
                    {new Date(task.expiresAt).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </section>

            {/* Recipient Logistics Section */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <User size={18} className="text-slate-400" />
                Delivery Endpoint / Buyer
              </h2>

              <div className="space-y-3.5">
                <div>
                  <span className="text-xs font-medium text-slate-400 block">Receiving Representative</span>
                  <p className="font-semibold text-slate-800 text-base mt-0.5">{buyer?.name || "Anonymous Consignee"}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-1">
                  <div className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Phone size={16} className="text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-slate-400 block">Secure Terminal Comms</span>
                      <a href={`tel:${buyer?.phone}`} className="font-medium text-blue-600 hover:underline">
                        {buyer?.phone || "Unavailable Link"}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-sm text-slate-600">
                    <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-slate-400 block">Drop Terminal Location</span>
                      <p className="font-medium text-slate-700 leading-relaxed">
                        {buyer?.address || "No target address specified."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Itemized Manifest Details */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
                <Layers size={18} className="text-slate-400" />
                Cargo Manifest Inventory
              </h2>

              <div className="divide-y divide-slate-100">
                {order?.sellerOrders?.length > 0 ? (
                  order.sellerOrders.map((item, index) => (
                    <div key={index} className="py-3.5 flex justify-between items-center text-sm first:pt-2 last:pb-1">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="font-medium text-slate-800">{item?.product?.name || "Generic Cargo Line"}</span>
                      </div>
                      <span className="bg-slate-100 font-mono text-xs font-bold text-slate-600 px-2.5 py-1 rounded-md border border-slate-200/50">
                        QTY: {item?.quantity || 0}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm text-slate-400">
                    No explicit item manifests associated with this transfer entity.
                  </div>
                )}
              </div>
            </section>
          </main>

          {/* Right Sidebar Details */}
          <aside className="space-y-6">
            
            {/* Operational Priority Block */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                Task Operational Urgency
              </h3>
              <div className={`w-fit inline-block text-xs font-bold px-3 py-1 border rounded-md uppercase tracking-wider ${getPriorityStyle(task.priority)}`}>
                {task.priority || "Standard"} Request
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Assignments classified with increased urgency thresholds should be prioritized for immediate vehicle routing.
              </p>
            </div>

            {/* Geo-Tracking Block Mockup */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-slate-400" />
                Spatial Routing Blueprint
              </h3>
              <div className="h-44 bg-slate-100 rounded-xl border border-slate-200/60 flex flex-col items-center justify-center text-center p-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 mb-2">
                  <MapPin size={20} />
                </div>
                <span className="text-xs font-bold text-slate-500 tracking-wide">Telemetry Integration Pending</span>
                <span className="text-[10px] text-slate-400 mt-0.5 max-w-[180px]">Interactive map rendering waiting for fleet driver confirmation.</span>
              </div>
            </div>

            {/* Critical Lifecycle Management Callouts */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <button
                disabled={actionLoading.accept || actionLoading.reject}
                onClick={() => handleAction("accept")}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-medium text-sm py-2.5 rounded-xl transition shadow-sm hover:shadow active:scale-[0.99]"
              >
                {actionLoading.accept ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                Accept Consignment
              </button>

              <button
                disabled={actionLoading.accept || actionLoading.reject}
                onClick={() => handleAction("reject")}
                className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-rose-50 border border-slate-200 disabled:bg-slate-50 text-rose-600 hover:text-rose-700 disabled:text-slate-400 font-medium text-sm py-2.5 rounded-xl transition active:scale-[0.99]"
              >
                {actionLoading.reject ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                Decline & Pass
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TransporterTaskDetails;