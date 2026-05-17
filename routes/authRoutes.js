const express = require("express");
const authController = require("../controllers/authController");
const { validate, registerSchema, loginSchema } = require("../middleware/validator");
const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

// Password recovery routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-petname", authController.verifyPetName);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
