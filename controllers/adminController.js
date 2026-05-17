const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

exports.approveDoctor = async (req, res) => {
  try {
    const { status } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isApproved: status },
      { new: true }
    );

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json({
      status: "success",
      data: { doctor },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    
    // Calculate total revenue
    const revenueData = await Appointment.aggregate([
      { $match: { status: "completed", paymentStatus: "paid" } },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctorInfo",
        },
      },
      { $unwind: "$doctorInfo" },
      { $group: { _id: null, totalRevenue: { $sum: "$doctorInfo.fees" } } },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    const appointmentsByStatus = await Appointment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Monthly revenue trend (last 6 months)
    const monthlyRevenue = await Appointment.aggregate([
      { $match: { status: "completed", paymentStatus: "paid" } },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctorInfo",
        },
      },
      { $unwind: "$doctorInfo" },
      {
        $group: {
          _id: { $month: "$date" },
          revenue: { $sum: "$doctorInfo.fees" },
        },
      },
      { $sort: { "_id": 1 } }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        totalRevenue,
        appointmentsByStatus,
        monthlyRevenue
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort("-createdAt");

    const total = await User.countDocuments();

    res.status(200).json({
      status: "success",
      results: users.length,
      total,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const { status, specialization } = req.query;
    const query = {};
    if (status) query.isApproved = status;
    if (specialization) query.specialization = specialization;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const doctors = await Doctor.find(query)
      .populate("userId", "name email profileImage")
      .skip(skip)
      .limit(limit)
      .sort("-createdAt");

    const total = await Doctor.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: doctors.length,
      total,
      data: { doctors },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(query)
      .populate("patientId", "name email")
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name" }
      })
      .skip(skip)
      .limit(limit)
      .sort("-date");

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: appointments.length,
      total,
      data: { appointments },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bcrypt = require("bcryptjs");

exports.createDoctor = async (req, res) => {
  try {
    const { name, username, email, password, petName, specialization, experience, fees, profileImage } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User with this email or username already exists" });
    }

    const user = await User.create({
      name,
      username,
      email,
      password,
      petName,
      role: "doctor",
      ...(profileImage && { profileImage })
    });

    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      experience,
      fees,
      isApproved: "approved", // Admin creates it, so it's auto-approved
    });

    res.status(201).json({
      status: "success",
      data: { doctor, user },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json({
      status: "success",
      data: { appointment },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const { name, email, specialization, experience, fees, profileImage } = req.body;
    
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Update Doctor specific fields
    doctor.specialization = specialization || doctor.specialization;
    doctor.experience = experience || doctor.experience;
    doctor.fees = fees || doctor.fees;
    await doctor.save();

    // Update User specific fields
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(profileImage && { profileImage })
    };
    
    const user = await User.findByIdAndUpdate(doctor.userId, updateData, { new: true });

    res.status(200).json({
      status: "success",
      data: { doctor, user },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Find the associated user and delete them as well
    const userId = doctor.userId;
    
    await Doctor.findByIdAndDelete(req.params.id);
    await User.findByIdAndDelete(userId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
