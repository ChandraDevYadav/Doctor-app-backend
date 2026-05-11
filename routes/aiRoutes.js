const express = require("express");
const aiController = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);

router.post("/symptom-checker", aiController.symptomChecker);
router.post("/chat", aiController.chatBot);
router.post("/recommendations", aiController.doctorRecommendation);
router.post("/appointment-optimizer", aiController.appointmentOptimizer);

module.exports = router;
