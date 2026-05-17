const Department = require("../models/Department");
const Service = require("../models/Service");
const Specialization = require("../models/Specialization");
const FeedbackStory = require("../models/FeedbackStory");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true }).sort("createdAt");
    res.status(200).json({ status: "success", data: { departments } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort("createdAt");
    res.status(200).json({ status: "success", data: { services } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSpecializations = async (req, res) => {
  try {
    const specializations = await Specialization.find({ isActive: true }).sort("createdAt");
    res.status(200).json({ status: "success", data: { specializations } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeedbackStories = async (req, res) => {
  try {
    const stories = await FeedbackStory.find({ isActive: true }).sort("createdAt");
    res.status(200).json({ status: "success", data: { stories } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments() || 150;
    const totalPatients = await User.countDocuments({ role: "patient" }) || 500;
    const totalAppointments = await Appointment.countDocuments() || 1250;
    const totalDepartments = await Department.countDocuments() || 9;

    res.status(200).json({
      status: "success",
      data: {
        patients: totalPatients > 10 ? totalPatients : 500,
        doctors: totalDoctors > 5 ? totalDoctors : 150,
        experience: 20,
        diagnosis: totalDepartments > 5 ? totalDepartments * 10 : 100
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
