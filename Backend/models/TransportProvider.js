import mongoose from "mongoose";
import validator from "validator";

const transportProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [4, "Transporter name must consist at least 4 characters"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format",
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    phone: {
      type: String,
      required: true,
      match: [/^(98|97)\d{8}$/, "Please enter a valid Nepali mobile number"],
    },

    profileImage: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },


    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true,
        default: [85.3240, 27.7172]
      },
      address: {
        type: String,
        default: "Kathmandu, Nepal"
      }
    },

    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },

    isKycCompleted: {
      type: Boolean,
      default: false,
    },

  
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    verifiedAt: Date,

    documents: {
      citizenshipCard: String,
      drivingLicense: String,
      vehicleRegistration: String,
    },


    vehicle: {
      type: {
        type: String,
        enum: ["Bike", "Pickup", "Truck", "Mini Truck"],
        required: false,
      },

      vehiclePhoto: {
        type: String,
      },

      numberPlate: {
        type: String,
        required: false,
      },
      capacityKg: {
        type: Number,
        required: false,
      },
    },


    serviceAreas: [
      {
        type: String,
      },
    ],


    pricePerKm: {
      type: Number,
      required: false,
    },


    isAvailable: {
      type: Boolean,
      default: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalDeliveries: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }

);

export const TransportProvider = mongoose.model("TransportProvider", transportProviderSchema);

