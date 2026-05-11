const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

exports.updateProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    res.status(200).json({
      status: "success",
      data: { doctor },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setAvailability = async (req, res) => {
  try {
    const { availabilitySlots } = req.body;
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user.id },
      { availabilitySlots },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      data: { doctor },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSchedule = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate("patientId", "name email profileImage")
      .sort("date timeSlot");

    res.status(200).json({
      status: "success",
      data: { appointments },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const doctor = await Doctor.findOne({ userId: req.user.id });
    
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, doctorId: doctor._id },
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      status: "success",
      data: { appointment },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
