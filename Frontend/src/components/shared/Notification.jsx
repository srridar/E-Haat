import React, { useState, useEffect, useMemo } from "react";
import { X, CheckCheckIcon, BellRingIcon, Loader2 } from "lucide-react"; 
import { useNavigate, useLocation } from "react-router-dom";
import useGetNotification from "@/hooks/sharedHooks/useGetNotification";
import {
  Package,
  ShoppingCart,
  Tag,
  ShieldCheck,
  Bell,
} from "lucide-react";

const getTypeStyles = (type) => {
  const styles = {
    order: {
      icon: <Package className="h-5 w-5" />,
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      color: "text-indigo-400"
    },
    purchase: {
      icon: <ShoppingCart className="h-5 w-5" />,
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      color: "text-emerald-400"
    },
    product: {
      icon: <Tag className="h-5 w-5" />,
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      color: "text-amber-400"
    },
    verification: {
      icon: <ShieldCheck className="h-5 w-5" />,
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      color: "text-purple-400"
    },
    default: {
      icon: <Bell className="h-5 w-5" />,
      bg: "bg-white/5",
      border: "border-white/10",
      color: "text-gray-400"
    },
  };

  return styles[type] || styles.default;
};

const Notification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.pathname.split("/")[1];
  const getNotifications = useGetNotification(role);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleClose = () => {
    role === "admin" ? navigate("/admin/dashboard") : navigate(`/${role}/profile`);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n._id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#111111] rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5 animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 bg-[#161616] border-b border-white/5">
          <button
            onClick={handleClose}
            className="absolute top-8 right-8 p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white  uppercase ">
                 <span className="text-indigo-500">Alerts</span>
              </h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">
                Currently <span className="text-indigo-400">{unreadCount} pending</span> notifications
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-2 text-[10px] font-black text-indigo-400 bg-indigo-500/5 px-4 py-2 rounded-full border border-indigo-500/20 hover:bg-indigo-500/20 transition-all uppercase tracking-widest"
              >
                <CheckCheckIcon className="h-4 w-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* List Content */}
        <div className="px-6 py-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {loading ? (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Scanning Signal...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-20 text-center relative overflow-hidden rounded-3xl border border-dashed border-white/5 bg-white/[0.01]">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-4">
                  <BellRingIcon className="h-10 w-10 text-gray-700" />
                </div>
                <p className="text-white font-black uppercase tracking-widest text-sm">Frequency Clear</p>
                <p className="text-xs text-gray-600 mt-2">No incoming transmissions detected.</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const style = getTypeStyles(notification.type);
                return (
                  <div
                    key={notification._id}
                    onClick={() => markAsRead(notification._id)}
                    className={`group relative flex gap-5 p-5 rounded-2xl border transition-all duration-300 cursor-pointer
                    ${notification.read
                    ? "bg-transparent border-white/5 opacity-50 hover:opacity-100": "bg-[#1A1A1A] border-white/10 shadow-lg hover:border-indigo-500/30"}`} >
                
                    {!notification.read && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-indigo-500 rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                    )}

                    <div className={`shrink-0 h-14 w-14 flex items-center justify-center rounded-2xl border ${style.bg} ${style.border} ${style.color}`}>
                      {style.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-[13px] font-black uppercase tracking-tight ${notification.read ? "text-gray-500" : "text-white"}`}>
                          {notification.title}
                        </h4>
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">
                          {notification.time}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed line-clamp-2 ${notification.read ? "text-gray-600" : "text-gray-400 font-medium"}`}>
                        {notification.message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

  
        <div className="p-6 bg-[#0A0A0A] border-t border-white/5 text-center">
          <button onClick={handleClose} className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-all">
            Return to Command Center
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
      `}} />
    </div>
  );
};

export default Notification;