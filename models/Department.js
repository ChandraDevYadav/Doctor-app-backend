const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    tabimage: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
