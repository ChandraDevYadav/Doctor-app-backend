const express = require("express");
const doctorController = require("../controllers/doctorController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);
router.use(restrictTo("doctor"));

router.patch("/profile", doctorController.updateProfile);
router.patch("/availability", doctorController.setAvailability);
router.get("/schedule", doctorController.getSchedule);
router.patch("/appointments/:id", doctorController.updateAppointmentStatus);

module.exports = router;
