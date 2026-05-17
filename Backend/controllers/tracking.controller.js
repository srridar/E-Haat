import { SellerOrder } from '../models/SellerOrder.js';
import { Order } from '../models/Order.js';
import { TransportProvider } from '../models/TransportProvider.js';




export const trackMainBuyerOrder = async (req, res) => {
    try {

        const buyerId = req.user.buyerId;
        const { orderId } = req.params;


        const order = await Order.findOne({
            _id: orderId,
            buyer: buyerId
        })

            .populate({
                path: "sellerOrders",

                populate: [
                    {
                        path: "seller",
                        select: "name email phone"
                    },
                    {
                        path: "products.product",
                        select: "name images price"
                    },
                ]
            });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


export const trackBuyerOrder = async (req, res) => {
    try {
        const buyerId = req.user.buyerId;
        const { orderId } = req.params;


        console.log("Tracking order for buyer:", buyerId, "orderId:", orderId);

        const order = await SellerOrder.findOne({ _id: orderId, buyer: buyerId })
            .populate("mainOrder", "paymentMethod paymentStatus overallStatus")
            .populate("seller", "name email")
            .populate({
                path: "products.product",
                select: "name images price"
            });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


export const trackTransporterLocation = async (req, res) => {

    try {

        const { sellerOrderId } = req.params;
        const sellerOrder = await SellerOrder.findById(sellerOrderId).populate("transporter");

        if (!sellerOrder) {
            return res.status(404).json({
                success: false,
                message: "Seller order not found"
            });
        }

        if (!sellerOrder.transporter) {
            return res.status(400).json({
                success: false,
                message: "Transporter not assigned"
            });
        }

        return res.status(200).json({
            success: true,
            transporter: {
                _id: sellerOrder.transporter._id,
                name: sellerOrder.transporter.name,
                phone: sellerOrder.transporter.phone,
                currentLocation: sellerOrder.transporter.currentLocation
            }
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


export const updateTransporterLocation = async (req, res) => {
    try {
        const transporterId = req.user.transporterId;
        const role = req.user?.role;

        if (role !== "transporter") {
            return res.status(403).json({
                success: false,
                message: "Only transporter can update location",
            });
        }


        const { latitude, longitude } = req.body;

        if (
            latitude === undefined ||
            longitude === undefined ||
            isNaN(latitude) ||
            isNaN(longitude)
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid latitude and longitude required",
            });
        }
        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "Transporter not found"
            });
        }

        transporter.currentLocation = {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
        };

        await transporter.save();

        return res.status(200).json({
            success: true,
            message: "Location updated successfully",
            currentLocation: transporter.currentLocation,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

