const express = require("express");
const adminController = require("../controllers/adminController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));

router.patch("/doctors/:id/approve", adminController.approveDoctor);
router.get("/doctors", adminController.getAllDoctors);
router.get("/analytics", adminController.getAnalytics);
router.get("/users", adminController.getAllUsers);
router.get("/appointments", adminController.getAllAppointments);

module.exports = router;
