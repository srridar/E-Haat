
import { Notification } from "../models/Notification.js";

export const sendOrderNotification = async ({ buyerId, sellerIds = [], orderId, totalAmount }) => {

    try {
        const notifications = [];
        notifications.push({
            receiver: buyerId,
            receiverModel: "Buyer",
            title: "Order Placed Successfully",
            message: `Your order has been placed successfully. Total amount Rs. ${totalAmount}.`,
            type: "order",
            referenceId: orderId
        });

        for (const sellerId of sellerIds) {
            notifications.push({
                receiver: sellerId,
                receiverModel: "Seller",
                title: "New Order Received",
                message: "You have received a new order. Please prepare items for dispatch.",
                type: "order",
                referenceId: orderId
            });
        }

        await Notification.insertMany(notifications);
        return true;

    } catch (error) {
        console.log("sendOrderNotification Error:", error);
        return false;
    }
};

export const transportRequestNotification = async ({ transporterId, sellerOrderId }) => {

    try {
        await Notification.create({

            receiver: transporterId,
            receiverModel: "TransportProvider",
            title: "New Transport Request",
            message: "You have received a new pickup and delivery request. Please accept before request expires.",
            type: "transport_request",
            referenceId: sellerOrderId
        });
        return true;
    } catch (error) {
        console.log(
            "transportRequestNotification Error:",
            error
        );
        return false;
    }
};

export const sendPickupNotification = async ({ sellerId, transporterId, sellerOrderId }) => {

    try {
        const notifications = [];
        if (sellerId) {
            notifications.push({
                receiver: sellerId,
                receiverModel: "Seller",
                title: "Pickup Assigned",
                message: "A transporter has been assigned to pick up your order. Please keep the package ready.",
                type: "pickup",
                referenceId: sellerOrderId
            });

        }

        if (transporterId) {
            notifications.push({
                receiver: transporterId,
                receiverModel: "TransportProvider",
                title: "New Pickup Task",
                message: "You have received a new pickup request. Please collect the package from the seller location.",
                type: "pickup",
                referenceId: sellerOrderId
            });

        }

        await Notification.insertMany(notifications);
        return true;

    } catch (error) {

        console.log("sendPickupNotification Error:", error);
        return false;
    }
};

export const sendDeliveryNotification = async ({ buyerId, transporterId, sellerOrderId, status }) => {
    try {
        const notifications = [];

        let buyerTitle = "";
        let buyerMessage = "";

        let transporterTitle = "";
        let transporterMessage = "";

        switch (status) {

            case "picked_up":

                buyerTitle = "Order Picked Up";
                buyerMessage = "Your order has been picked up from the seller and is now in transit.";

                transporterTitle = "Pickup Completed";
                transporterMessage = "You successfully picked up the package from seller.";
                break;

            case "in_transit":

                buyerTitle = "Order In Transit";
                buyerMessage = "Your package is currently on the way.";

                transporterTitle = "Delivery In Progress";
                transporterMessage = "Continue delivery process carefully.";
                break;

            case "out_for_delivery":

                buyerTitle = "Out For Delivery";
                buyerMessage = "Your package is out for delivery and will arrive soon.";

                transporterTitle = "Out For Delivery";
                transporterMessage = "Package is now out for final delivery.";
                break;

            case "delivered":

                buyerTitle = "Order Delivered";
                buyerMessage = "Your package has been delivered successfully.";

                transporterTitle = "Delivery Completed";
                transporterMessage = "Delivery completed successfully.";
                break;

            case "delivery_failed":

                buyerTitle = "Delivery Attempt Failed";
                buyerMessage = "Delivery attempt failed. Please coordinate with transporter.";

                transporterTitle = "Delivery Failed";
                transporterMessage = "Delivery attempt failed. Update delivery notes.";
                break;

            default: return false;
        }

        if (buyerId) {

            notifications.push({
                receiver: buyerId,
                receiverModel: "Buyer",
                title: buyerTitle,
                message: buyerMessage,
                type: "delivery",
                referenceId: sellerOrderId
            });

        }

        if (transporterId) {

            notifications.push({
                receiver: transporterId,
                receiverModel: "TransportProvider",
                title: transporterTitle,
                message: transporterMessage,
                type: "delivery",
                referenceId: sellerOrderId
            });

        }

        await Notification.insertMany(notifications);
        return true;

    } catch (error) {
        console.log("sendDeliveryNotification Error:", error);
        return false;
    }
};

export const sendComplaintNotification = async ({ buyerId, sellerId, transporterId, complaintId, status }) => {

    try {

        const notifications = [];

        let buyerTitle = "";
        let buyerMessage = "";

        let sellerTitle = "";
        let sellerMessage = "";

        let transporterTitle = "";
        let transporterMessage = "";

        switch (status) {

            case "raised":

                buyerTitle = "Complaint Submitted";
                buyerMessage = "Your complaint has been submitted successfully. Our team will review it shortly.";

                sellerTitle = "Complaint Received";
                sellerMessage = "A complaint has been raised against one of your orders. Please review the issue.";

                transporterTitle = "Complaint Alert";
                transporterMessage = "A complaint related to your delivery task has been raised.";
                break;

            case "under_review":

                buyerTitle = "Complaint Under Review";
                buyerMessage = "Your complaint is currently under admin review.";

                sellerTitle = "Complaint Under Investigation";
                sellerMessage = "Admin is currently reviewing the complaint related to your order.";

                transporterTitle = "Complaint Investigation Started";
                transporterMessage = "Admin is reviewing the complaint associated with your delivery.";
                break;

            case "resolved":

                buyerTitle = "Complaint Resolved";
                buyerMessage = "Your complaint has been resolved successfully.";

                sellerTitle = "Complaint Resolved";
                sellerMessage = "The complaint associated with your order has been resolved.";

                transporterTitle = "Complaint Closed";
                transporterMessage = "The complaint linked to your delivery has been resolved.";
                break;

            case "rejected":

                buyerTitle = "Complaint Rejected";
                buyerMessage = "Your complaint request has been rejected after review.";

                sellerTitle = "Complaint Dismissed";
                sellerMessage = "The complaint raised against your order has been dismissed.";

                transporterTitle = "Complaint Dismissed";
                transporterMessage = "The complaint associated with your delivery has been dismissed.";
                break;

            case "refund_processed":

                buyerTitle = "Refund Processed";
                buyerMessage = "Your refund has been processed successfully.";

                sellerTitle = "Refund Issued";
                sellerMessage = "Refund has been issued for the disputed order.";

                transporterTitle = "Refund Completed";
                transporterMessage = "Refund process related to complaint has been completed.";
                break;

            default:
                return false;
        }

        if (buyerId) {

            notifications.push({
                receiver: buyerId,
                receiverModel: "Buyer",
                title: buyerTitle,
                message: buyerMessage,
                type: "complaint",
                referenceId: complaintId
            });

        }

        if (sellerId) {

            notifications.push({
                receiver: sellerId,
                receiverModel: "Seller",
                title: sellerTitle,
                message: sellerMessage,
                type: "complaint",
                referenceId: complaintId
            });

        }

        if (transporterId) {

            notifications.push({
                receiver: transporterId,
                receiverModel: "TransportProvider",
                title: transporterTitle,
                message: transporterMessage,
                type: "complaint",
                referenceId: complaintId
            });

        }

        await Notification.insertMany(notifications);
        return true;

    } catch (error) {
        console.log("sendComplaintNotification Error:", error);
        return false;
    }
};