const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  status: { type: String, enum: ["active", "suspended"], default: "active" },
  settings: { type: Map, of: String, default: {} }, // e.g., timezone, logo, contact
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Tenant", tenantSchema);
