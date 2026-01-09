import React, { useState } from "react";

const notificationsData = [
  {
    id: 1,
    type: "order",
    title: "New Order Received",
    message: "You received a new order for Fresh Apples (5kg).",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "purchase",
    title: "Purchase Successful",
    message: "Your order for Organic Rice has been placed successfully.",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 3,
    type: "product",
    title: "Product Approved",
    message: "Your product 'Local Honey' has been approved by admin.",
    time: "Yesterday",
    read: false,
  },
  {
    id: 4,
    type: "verification",
    title: "Seller Verified",
    message: "Your seller account is now verified.",
    time: "2 days ago",
    read: true,
  },
  {
    id: 5,
    type: "system",
    title: "System Update",
    message: "New features have been added to E-haat.",
    time: "3 days ago",
    read: true,
  },
];

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

const Notification = () => {
  const [notifications, setNotifications] = useState(notificationsData);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background-light)] px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">

        {/* Header */}
        <div className="mb-6 border-b pb-3">
          <h2 className="text-2xl font-bold text-[var(--primary-green)]">
            Notifications
          </h2>
          <p className="text-sm text-[var(--text-gray)]">
            Stay updated with your activity on E-haat
          </p>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No notifications available
            </p>
          ) : (
            notifications.map((n) => {
              const style = getTypeStyles(n.type);

              return (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`flex gap-4 items-start p-4 rounded-xl border cursor-pointer transition
                  ${n.read ? "bg-white" : "bg-[var(--background-light)]"}
                  hover:shadow`}
                >
                  {/* Icon */}
                  <div
                    className={`h-12 w-12 flex items-center justify-center rounded-full ${style.bg}`}
                  >
                    <span className="text-xl">{style.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {n.title}
                    </h4>
                    <p className="text-sm text-[var(--text-gray)] mt-1">
                      {n.message}
                    </p>
                    <span className="text-xs text-gray-400 mt-1 inline-block">
                      {n.time}
                    </span>
                  </div>

                  {!n.read && (
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
