const express = require("express");
const patientController = require("../controllers/patientController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/doctors", patientController.getAllDoctors);
router.post("/book", patientController.bookAppointment); // Auth disabled for demo
router.use(protect);
router.use(restrictTo("patient"));
router.get("/appointments", patientController.getMyAppointments);
router.patch("/appointments/:id/cancel", patientController.cancelAppointment);
router.post("/reviews", patientController.addReview);

module.exports = router;
