const mongoose = require("mongoose");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const dotenv = require("dotenv");

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB for seeding...");

    // Create a doctor user
    const doctorUser = await User.create({
      name: "Dr. Jason Kovalsky",
      email: "jason@test.com",
      password: "password123",
      role: "doctor",
    });

    // Create doctor profile
    const doctor = await Doctor.create({
      userId: doctorUser._id,
      specialization: "Cardiologist",
      experience: 10,
      fees: 100,
      isApproved: "approved",
      availabilitySlots: [
        { day: "Monday", slots: [{ start: "09:00", end: "12:00" }] }
      ]
    });

    console.log("✅ Seeded one approved doctor!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
