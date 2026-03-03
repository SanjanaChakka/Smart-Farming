const mongoose = require("mongoose");

const scanHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    cropType: {
      type: String,
      required: true,
    },
    disease: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["None", "Mild", "Moderate", "Severe"],
      default: "None",
    },
    cause: {
      type: String,
      default: "",
    },
    confidence: {
      type: Number,
      default: 0,
    },
    treatment: {
      type: [String],
      default: [],
    },
    prevention: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Healthy", "Diseased"],
      default: "Healthy",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ScanHistory", scanHistorySchema);