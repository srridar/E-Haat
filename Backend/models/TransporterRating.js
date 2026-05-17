import mongoose from "mongoose";

const transporterRatingSchema =
new mongoose.Schema({

    sellerOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SellerOrder",
        required: true
    },

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Buyer",
        required: true
    },

    transporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TransportProvider",
        required: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    review: {
        type: String,
        trim: true
    }

}, { timestamps: true });

export const TransporterRating =
mongoose.model(
    "TransporterRating",
    transporterRatingSchema
);