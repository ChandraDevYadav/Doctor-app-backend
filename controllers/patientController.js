const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Review = require("../models/Review");
const User = require("../models/User");

exports.getAllDoctors = async (req, res) => {
  try {
    const { specialization, search, minFees, maxFees } = req.query;
    let query = { isApproved: "approved" };

    if (specialization) query.specialization = specialization;
    if (minFees || maxFees) {
      query.fees = {};
      if (minFees) query.fees.$gte = Number(minFees);
      if (maxFees) query.fees.$lte = Number(maxFees);
    }

    let doctors = await Doctor.find(query).populate("userId", "name profileImage");

    if (search) {
      doctors = doctors.filter((doc) =>
        doc.userId.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json({
      status: "success",
      results: doctors.length,
      data: { doctors },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, notes } = req.body;
    const patientId = req.user ? req.user.id : "651d00000000000000000001"; // Dummy ID for demo

    // Check if slot is available (Simple check for now)
    const existingAppointment = await Appointment.findOne({ doctorId, date, timeSlot, status: "confirmed" });
    if (existingAppointment) {
      return res.status(400).json({ message: "This time slot is already booked" });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      timeSlot,
      notes,
    });

    res.status(201).json({
      status: "success",
      data: { appointment },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name profileImage" },
      })
      .sort("-date");

    res.status(200).json({
      status: "success",
      data: { appointments },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, patientId: req.user.id },
      { status: "cancelled" },
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

exports.addReview = async (req, res) => {
  try {
    const { doctorId, rating, comment } = req.body;
    const patientId = req.user.id;

    const review = await Review.create({
      patientId,
      doctorId,
      rating,
      comment,
    });

    // Update doctor ratings (simplistic)
    const reviews = await Review.find({ doctorId });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Doctor.findByIdAndUpdate(doctorId, {
      ratings: avgRating,
      numReviews: reviews.length,
    });

    res.status(201).json({
      status: "success",
      data: { review },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
