require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const socketService = require("./services/socketService");

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
socketService.init(server);

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Atlas Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Atlas Connection Error:", err.message);
    if (process.env.NODE_ENV === "development") {
      console.log("⚠️ Falling back to MongoDB Memory Server...");
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log("✅ MongoDB Memory Server Connected Successfully");
    } else {
      process.exit(1);
    }
  }
};

connectDB().then(async () => {
  if (process.env.NODE_ENV === "development") {
    const Doctor = require("./models/Doctor");
    const User = require("./models/User");
    const count = await Doctor.countDocuments();
    if (count === 0) {
      console.log("🌱 Seeding initial doctor...");
      const user = await User.create({
        name: "Dr. Jason Kovalsky",
        email: "jason@test.com",
        password: "password123",
        role: "doctor",
        profileImage: "/hp2.jpg",
      });
      await Doctor.create({
        userId: user._id,
        specialization: "Cardiologist",
        experience: 10,
        fees: 100,
        isApproved: "approved",
      });
      console.log("✅ Initial doctor seeded!");
    }
  }
  server.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
