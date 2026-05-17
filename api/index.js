const mongoose = require("mongoose");
const app = require("../app");
require("dotenv").config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    if (!process.env.MONGODB_URI) {
      console.warn("⚠️ MONGODB_URI not set in Vercel environment variables");
      return;
    }
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB Atlas Connected (Vercel Serverless)");
  } catch (err) {
    console.error("❌ MongoDB Atlas Connection Error:", err.message);
  }
};

// Middleware to ensure DB connection on every serverless invocation
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

module.exports = app;
