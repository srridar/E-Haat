import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, MapPin, Clock, AlertTriangle, Briefcase, RefreshCw } from "lucide-react";
import axios from "axios";


const PRIORITY_STYLES = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  default: "bg-slate-50 text-slate-700 border-slate-200",
};

const PriorityBadge = ({ priority }) => {
  const normalized = priority?.toLowerCase();
  const theme = PRIORITY_STYLES[normalized] || PRIORITY_STYLES.default;
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider border ${theme}`}>
      {priority || "Standard"} Priority
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const isWaiting = status?.toLowerCase() === "waiting";
  const theme = isWaiting 
    ? "bg-yellow-50 text-yellow-800 border-yellow-200" 
    : "bg-blue-50 text-blue-800 border-blue-200";
    
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize border ${theme}`}>
      {status}
    </span>
  );
};


const TransporterTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const fetchTasks = useCallback(async (abortController) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get("/api/transporter/get-availabe-tasks", {
        withCredentials: true,
        signal: abortController?.signal, 
      });

      if (res.data?.success) {

        setTasks(res.data.tasks || []);
      } else {
        setError(res.data?.message || "Failed to parse available operations query.");
      }
    } catch (err) {
      if (axios.isCancel(err)) return; // Gracefully drop updating if request was aborted
      console.error("[LOGISTICS ENGINE] Failed to fetch transporter tasks:", err);
      setError("An operational error occurred while loading tasks. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchTasks(abortController);

    return () => abortController.abort(); 
  }, [fetchTasks]);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-3" aria-live="polite">
        <Loader2 className="animate-spin w-9 h-9 text-blue-600" />
        <p className="text-sm font-medium text-slate-500 tracking-wide">Syncing real-time manifest...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen antialiased font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Upper Action Header */}
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Available Dispatch Routes
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              Review and claim pending platform transit assignments. Click cards to view manifest logs.
            </p>
          </div>
          <button
            onClick={() => fetchTasks()}
            className="inline-flex items-center justify-center gap-2 self-start sm:self-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:text-slate-900 transition duration-150 active:scale-[0.98]"
          >
            <RefreshCw size={15} className="text-slate-500" />
            Refresh Queue
          </button>
        </header>

        {/* Content Matrix Container */}
        <main>
          {error ? (
            /* System Level Failures */
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-base font-bold text-red-900 mb-1">Network Synchronization Failure</h3>
              <p className="text-sm text-red-700 mb-5">{error}</p>
              <button
                onClick={() => fetchTasks()}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition active:scale-[0.98]"
              >
                Retry Gateway Connection
              </button>
            </div>
          ) : tasks.length === 0 ? (
            /* Clear / Empty State Worklist */
            <div className="bg-white border border-slate-200 rounded-xl p-16 text-center max-w-xl mx-auto shadow-sm">
              <Briefcase className="w-14 h-14 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">Queue Rested</h3>
              <p className="text-sm text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                All logistical transfers have been claimed or cleared. Refresh to scan for updated assignments.
              </p>
            </div>
          ) : (
            /* Operational Task Layout Grid */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => {
                const displayId = task.sellerOrder?._id?.slice(-8).toUpperCase() || "N/A";
                const isUrgent = task.priority?.toLowerCase() === "high";

                return (
                  <article
                    key={task._id}
                    onClick={() => navigate(`/transporter/task/${task._id}`)}
                    className={`group cursor-pointer bg-white rounded-xl shadow-sm border p-5 flex flex-col justify-between transition-all duration-200 ${
                      isUrgent 
                        ? "hover:border-red-300 hover:shadow-red-50/50 hover:shadow-md" 
                        : "hover:border-blue-400 hover:shadow-md"
                    }`}
                  >
                    <div>
                      {/* Top Header Row */}
                      <div className="flex justify-between items-center gap-2 mb-5">
                        <PriorityBadge priority={task.priority} />
                        <StatusBadge status={task.status} />
                      </div>

                      {/* Primary Text Fields */}
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-0.5">
                            Order Hash ID
                          </span>
                          <p className="font-mono text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition duration-150">
                            #{displayId}
                          </p>
                        </div>

                        <div className="flex items-start gap-2.5 text-slate-600">
                          <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                          <div className="text-sm">
                            <span className="font-bold text-slate-400 block text-[10px] uppercase tracking-widest mb-0.5">
                              Drop Destination
                            </span>
                            <p className="font-medium text-slate-700 line-clamp-2 leading-relaxed">
                              {task.sellerOrder?.buyer?.address || "Muted/No terminal assigned"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Meta Footer Fields */}
                    <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Clock size={14} className="text-slate-400 shrink-0" />
                        <span>
                          Created: {task.createdAt ? new Date(task.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }) : "---"}
                        </span>
                      </div>

                      {task.expiresAt && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-1.5 rounded-lg">
                          <AlertTriangle size={14} className="shrink-0 text-amber-500" />
                          <span>
                            Lockout Expires: {new Date(task.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default TransporterTasks;