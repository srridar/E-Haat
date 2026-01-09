import Notification from "../models/notification.model.js";


await Notification.create({
  user: buyerId,
  role: "buyer",
  type: "purchase",
  title: "Order Placed",
  message: "Your order has been placed successfully.",
  relatedId: order._id,
});


await Notification.create({
  user: sellerId,
  role: "seller",
  type: "order",
  title: "New Order Received",
  message: "You received a new order.",
  relatedId: order._id,
});


await Notification.create({
  user: sellerId,
  role: "seller",
  type: "product",
  title: "Product Approved",
  message: "Your product has been approved by admin.",
  relatedId: productId,
});

await Notification.create({
  user: transporterId,
  role: "transporter",
  type: "delivery",
  title: "Delivery Assigned",
  message: "A new delivery has been assigned to you.",
  relatedId: orderId,
});


await Notification.create({
  user: adminId,
  role: "admin",
  type: "system",
  title: "System Alert",
  message: "New seller registration pending approval.",
});