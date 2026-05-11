const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");

exports.createPaymentIntent = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId).populate("doctorId");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: appointment.doctorId.fees * 100, // in cents
      currency: "usd",
      metadata: { appointmentId: appointment._id.toString() },
    });

    res.status(200).json({
      status: "success",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { appointmentId, transactionId, method } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
      paymentStatus: "paid",
      status: "confirmed",
    });

    const payment = await Payment.create({
      appointmentId,
      amount: req.body.amount,
      method,
      status: "completed",
      transactionId,
    });

    res.status(200).json({
      status: "success",
      data: { payment },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
