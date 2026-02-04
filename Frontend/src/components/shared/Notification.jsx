import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import useGetNotification from "@/hooks/sharedHooks/useGetNotification";

const Notification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.pathname.split("/")[1];

  const handleClose = () => {
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate(`/${role}/profile`);
    }
  };

  console.log("ROLE:", role);
  const getNotifications = useGetNotification(role);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getNotifications();
      setNotifications(data || []);
    };

    fetchNotifications();
  }, []);

  const getTypeStyles = (type) => {
    switch (type) {
      case "order":
        return { icon: "📦", bg: "bg-blue-100", text: "text-blue-700" };
      case "purchase":
        return { icon: "🛒", bg: "bg-green-100", text: "text-green-700" };
      case "product":
        return { icon: "🏷️", bg: "bg-orange-100", text: "text-orange-700" };
      case "verification":
        return { icon: "✅", bg: "bg-purple-100", text: "text-purple-700" };
      default:
        return { icon: "🔔", bg: "bg-gray-100", text: "text-gray-700" };
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, read: true } : n
      )
    );
  };

  return (
    <div className=" bg-black/40 flex justify-center items-center w-full min-h-[100vh] ">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 relative">

        <button onClick={handleClose} className="absolute top-4 right-4 p-1  rounded hover:bg-gray-100">
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        </button>

        <div className="mb-6 border-b pb-3">
          <h2 className="text-2xl font-bold text-[var(--primary-green)]">
            Notifications
          </h2>
          <p className="text-sm text-[var(--text-gray)]">
            Stay updated with your activity on E-haat
          </p>
        </div>


        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No notifications available
            </p>
          ) : (
            notifications.map((notification) => {
              const style = getTypeStyles(notification.type);

              return (
                <div
                  key={notification._id}
                  onClick={() => markAsRead(notification._id)}
                  className={`flex gap-4 items-start p-4 rounded-xl border cursor-pointer transition
                  ${notification.read ? "bg-white" : "bg-[var(--background-light)]"}
                  hover:shadow`}
                >

                  <div className={`h-12 w-12 flex items-center justify-center rounded-full ${style.bg}`}>
                    <span className="text-xl">{style.icon}</span>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-[var(--text-gray)] mt-1">
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-400 mt-1 inline-block">
                      {notification.time}
                    </span>
                  </div>

                  {!notification.read && (
                    <span className="h-2 w-2 bg-green-500 rounded-full mt-2"></span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
