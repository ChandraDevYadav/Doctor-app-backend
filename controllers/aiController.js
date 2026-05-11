const aiService = require("../services/aiService");
const Doctor = require("../models/Doctor");

exports.symptomChecker = async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms) return res.status(400).json({ message: "Symptoms are required" });

    const result = await aiService.analyzeSymptoms(symptoms);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.chatBot = async (req, res) => {
  try {
    const { message, history } = req.body;
    const result = await aiService.getBookingAssistance(message, history || []);
    res.status(200).json({ status: "success", data: { reply: result } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.doctorRecommendation = async (req, res) => {
  try {
    const { symptoms } = req.body;
    const doctors = await Doctor.find({ isApproved: "approved" }).populate("userId", "name");
    
    const recommendations = await aiService.recommendDoctors(symptoms, doctors);
    res.status(200).json({ status: "success", data: recommendations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.appointmentOptimizer = async (req, res) => {
  try {
    const { doctorId, date } = req.body;
    const Appointment = require("../models/Appointment");
    const existingAppointments = await Appointment.find({ doctorId, date, status: "confirmed" }).select("timeSlot");
    
    const result = await aiService.suggestOptimalSlots(doctorId, date, existingAppointments);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
