const mongoose = require("mongoose");

const staySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    rent: { type: Number, required: true },
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    images: { type: [String], default: [] },

    // Owner who added the stay
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },

    /**
     * ⭐ NEW FIELD — Status instead of only isApproved
     * This will help you:
     * - Show pending stays to Admin
     * - Show only approved stays to Users
     * - Show ALL stays to Owner
     */
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stay", staySchema);
