
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  role: {
    type: String,
    enum: ["superadmin", "Admin"],
    default: "Admin"
  },

  permissions: [String],

  phone: {
    type: String,
    required: true
  },

  profileImage: {
    url: {
        type: String,
        default: ""
    },
    public_id: {
        type: String,
        default: ""
    }
},

  emailVerified: {
    type: Boolean,
    default: false
  },

  lastLogin: Date,

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,

  loginAttempts: {
    type: Number,
    default: 0
  },

  lockUntil: Date,

  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification"
    }
  ],

  isActive: {
    type: Boolean,
    default: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  }

}, { timestamps: true });

export const Admin = mongoose.model("Admin", adminSchema);
