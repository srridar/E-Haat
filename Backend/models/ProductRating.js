import mongoose from "mongoose";

const productRatingSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Buyer",
        required: true
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
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
        trim: true
    }
},{timestamps:true });

export const ProductRating =mongoose.model("ProductRating", productRatingSchema);