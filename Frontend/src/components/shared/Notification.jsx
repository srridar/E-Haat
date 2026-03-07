import React, { useState, useEffect, useMemo } from "react";
import { X, CheckCheckIcon, BellRingIcon } from "lucide-react"; 
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
      bg: "bg-blue-50",
      border: "border-blue-100",
      color: "text-blue-600"
    },
    purchase: {
      icon: <ShoppingCart className="h-5 w-5" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      color: "text-emerald-600"
    },
    product: {
      icon: <Tag className="h-5 w-5" />,
      bg: "bg-amber-50",
      border: "border-amber-100",
      color: "text-amber-600"
    },
    verification: {
      icon: <ShieldCheck className="h-5 w-5" />,
      bg: "bg-purple-50",
      border: "border-purple-100",
      color: "text-purple-600"
    },
    default: {
      icon: <Bell className="h-5 w-5" />,
      bg: "bg-slate-50",
      border: "border-slate-100",
      color: "text-slate-600"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">

        <div className="relative px-8 pt-8 pb-6 bg-gradient-to-b from-gray-50 to-white">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Notifications
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                You have <span className="font-semibold text-[var(--primary-green)]">{unreadCount} unread</span> messages
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-xs font-medium text-[var(--primary-green)] hover:opacity-80 transition-opacity"
              >
                <CheckCheckIcon className="h-4 w-4" />
                Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="px-6 pb-8 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
          <div className="space-y-3">
            {loading ? (
              <div className="py-20 text-center animate-pulse text-gray-400">Loading your updates...</div>
            ) : notifications.length === 0 ? (
              <div className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                  <BellRingIcon className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">All caught up!</p>
                <p className="text-sm text-gray-400">No new notifications at the moment.</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const style = getTypeStyles(notification.type);
                return (
                  <div
                    key={notification._id}
                    onClick={() => markAsRead(notification._id)}
                    className={`group relative flex gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer
                    ${notification.read
                    ? "bg-white border-gray-100 opacity-75 hover:opacity-100": "bg-white border-transparent shadow-sm ring-1 ring-black/5 hover:shadow-md"}`} >
                
                    {!notification.read && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--primary-green)] rounded-r-full" />
                    )}

                    <div className={`shrink-0 h-12 w-12 flex items-center justify-center rounded-xl border ${style.bg} ${style.border}`}>
                      <span className="text-xl">{style.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-[15px] font-bold truncate ${notification.read ? "text-gray-600" : "text-gray-900"}`}>
                          {notification.title}
                        </h4>
                        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider ml-2">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

    
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
          <button  onClick={handleClose} className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;