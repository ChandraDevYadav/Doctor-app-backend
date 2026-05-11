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
