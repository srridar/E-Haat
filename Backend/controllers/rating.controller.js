import { SellerRating } from '../models/SellerRating.js';
import { ProductRating } from '../models/ProductRating.js';
import { TransporterRating } from '../models/TransporterRating.js'



const updateAverageRating = async (model, targetId, fieldName) => {

    const ratings = await model.find({ [fieldName]: targetId });
    const totalRatings = ratings.length;
    const averageRating = totalRatings === 0 ? 0 : ratings.reduce((sum, item) => sum + item.rating, 0) / totalRatings;


    return {
        averageRating: Number(averageRating.toFixed(1)),
        totalRatings
    };
}

export const rateSeller = async (req, res) => {

    try {

        const buyerId = req.user.buyerId;
        const { sellerOrderId, rating, review } = req.body;

        if (!sellerOrderId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Seller order and rating required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message:
                    "Rating must be between 1 and 5"
            });
        }

        const sellerOrder = await SellerOrder.findById(sellerOrderId);

        if (!sellerOrder) {
            return res.status(404).json({
                success: false,
                message: "Seller order not found"
            });
        }

        // Ownership validation
        if (sellerOrder.buyer.toString() !== buyerId.toString()) {
            return res.status(403).json({
                success: false,
                message:
                    "Unauthorized"
            });
        }

        // Delivery validation
        if (sellerOrder.status !== "delivered") {
            return res.status(400).json({
                success: false,
                message: "Cannot rate before delivery"
            });
        }

        // Duplicate prevention
        const existingRating = await SellerRating.findOne({ buyer: buyerId, sellerOrder: sellerOrderId });

        if (existingRating) {
            return res.status(400).json({
                success: false,
                message:
                    "Seller already rated"
            });
        }

        const sellerRating = await SellerRating.create({
            order: sellerOrder.order,
            sellerOrder: sellerOrder._id,
            buyer: buyerId,
            seller: sellerOrder.seller,
            rating,
            review
        });

        // Update seller average
        const stats = await updateAverageRating(
            SellerRating,
            sellerOrder.seller,
            "seller"
        );

        await Seller.findByIdAndUpdate(
            sellerOrder.seller,
            {
                rating: stats.averageRating,
                totalRatings: stats.totalRatings
            }
        );

        return res.status(201).json({
            success: true,
            message:
                "Seller rated successfully",
            sellerRating
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message:
                "Internal Server Error"
        });
    }
};

export const rateProduct = async (req, res) => {

    try {

        const buyerId = req.user.buyerId;

        const { sellerOrderId, productId, rating, review } = req.body;

        const sellerOrder = await SellerOrder.findById(sellerOrderId);

        if (!sellerOrder) {
            return res.status(404).json({
                success: false,
                message:
                    "Seller order not found"
            });
        }

        // Ensure product exists in order
        const orderedProduct =
            sellerOrder.products.find(
                item =>
                    item.product.toString()
                    === productId
            );

        if (!orderedProduct) {
            return res.status(400).json({
                success: false,
                message:
                    "Product not found in this order"
            });
        }

        // Delivery validation
        if (sellerOrder.status !== "delivered") {
            return res.status(400).json({
                success: false,
                message: "Cannot rate before delivery"
            });
        }

        // Prevent duplicate
        const existing = await ProductRating.findOne({
            buyer: buyerId,
            product: productId,
            order: sellerOrder.order
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Product already rated"
            });
        }

        const productRating = await ProductRating.create({
            order: sellerOrder.order,
            buyer: buyerId,
            product: productId,
            seller: sellerOrder.seller,
            rating,
            review
        });

        // Update product stats
        const stats = await updateAverageRating(
            ProductRating,
            productId,
            "product"
        );

        await Product.findByIdAndUpdate(productId,
            {
                averageRating: stats.averageRating,
                totalRatings: stats.totalRatings
            }
        );

        return res.status(201).json({
            success: true,
            message: "Product rated successfully",
            productRating
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const rateTransporter = async (req, res) => {

    try {

        const buyerId = req.user.buyerId;

        const {
            sellerOrderId,
            rating,
            review
        } = req.body;

        const sellerOrder = await SellerOrder.findById(sellerOrderId);

        if (!sellerOrder) {
            return res.status(404).json({
                success: false,
                message:
                    "Seller order not found"
            });
        }

        // Ownership check
        if (sellerOrder.buyer.toString() !== buyerId.toString()) {
            return res.status(403).json({
                success: false,
                message:
                    "Unauthorized"
            });
        }

        // Must be delivered
        if (sellerOrder.status !== "delivered") {
            return res.status(400).json({
                success: false,
                message: "Cannot rate before delivery"
            });
        }

        // Must have transporter
        if (!sellerOrder.transporter) {
            return res.status(400).json({
                success: false,
                message: "No transporter assigned"
            });
        }

        // Duplicate prevention
        const existing = await TransporterRating.findOne({ buyer: buyerId, sellerOrder: sellerOrderId });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Transporter already rated"
            });
        }

        const transporterRating =
            await TransporterRating.create({
                sellerOrder: sellerOrder._id,
                buyer: buyerId,
                transporter: sellerOrder.transporter,
                rating,
                review
            });

        // Update transporter stats
        const stats = await updateAverageRating(
            TransporterRating,
            sellerOrder.transporter,
            "transporter"
        );

        await TransportProvider.findByIdAndUpdate(
            sellerOrder.transporter,
            {
                rating: stats.averageRating,
                totalRatings: stats.totalRatings
            }
        );

        return res.status(201).json({
            success: true,
            message: "Transporter rated successfully",
            transporterRating
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message:
                "Internal Server Error"
        });
    }
};

