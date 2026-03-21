import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "senderModel",
        },
        senderModel: {
            type: String,
            required: true,
            enum: ["Admin", "Seller", "TransportProvider", "Buyer"],
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "receiverModel",
        },
        receiverModel: {
            type: String,
            required: true,
            enum: ["Admin", "Seller", "TransportProvider", "Buyer"],
        },
        text: {
            type: String,
            trim: true,
        },
        seen: {
            type: Boolean,
            default: false,
        },
        edited: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);