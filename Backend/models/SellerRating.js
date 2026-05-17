import mongoose from "mongoose";

const sellerRatingSchema =
new mongoose.Schema({

    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },

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

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
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
        trim: true,
        maxlength: 1000
    }

}, { timestamps: true });

export const SellerRating = mongoose.model( "SellerRating", sellerRatingSchema);