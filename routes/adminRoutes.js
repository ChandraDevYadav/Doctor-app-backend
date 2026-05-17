const express = require("express");
const adminController = require("../controllers/adminController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));

router.post("/doctors", adminController.createDoctor);
router.patch("/doctors/:id/approve", adminController.approveDoctor);
router.get("/doctors", adminController.getAllDoctors);
router.patch("/doctors/:id", adminController.updateDoctor);
router.delete("/doctors/:id", adminController.deleteDoctor);
router.get("/analytics", adminController.getAnalytics);
router.get("/users", adminController.getAllUsers);
router.get("/appointments", adminController.getAllAppointments);
router.patch("/appointments/:id/status", adminController.updateAppointmentStatus);

module.exports = router;
