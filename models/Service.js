const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    bgColor: { type: String, default: "#3156a3" },
    tagColor: { type: String, default: "#0071ef" },
    layoutType: { type: String, enum: ["card", "split"], default: "card" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
