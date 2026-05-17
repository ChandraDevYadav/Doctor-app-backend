const express = require("express");
const contentController = require("../controllers/contentController");
const router = express.Router();

router.get("/departments", contentController.getDepartments);
router.get("/services", contentController.getServices);
router.get("/specializations", contentController.getSpecializations);
router.get("/feedback-stories", contentController.getFeedbackStories);
router.get("/stats", contentController.getStats);

module.exports = router;
