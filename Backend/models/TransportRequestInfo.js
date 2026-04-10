import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    province: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    municipality: {
      type: String,
      required: true,
      trim: true,
    },
    ward: {
      type: String, 
      required: true,
      trim: true,
    },
    landmark: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    }

  },
  { _id: false }
);

const transportRequestInfoSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer", 
      required: true,
    },

    transporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportProvider",
      required: true,
    },

    pickupLocation: {
      type: locationSchema,
      required: true,
    },

    destinationLocation: {
      type: locationSchema,
      required: true,
    },

    itemDescription: {
      type: String,
      required: true,
      trim: true,
    },

    weightKg: {
      type: Number,
      required: true,
      min: 1,
    },

    deliveryDate: {
      type: Date,
      required: true,
    },

    offeredPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    estimatedDistanceKm: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "countered",
        "in_transit",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "escrow", "paid"],
      default: "unpaid",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const TransportRequestInfo = mongoose.model( "TransportRequestInfo", transportRequestInfoSchema);