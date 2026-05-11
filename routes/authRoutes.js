const express = require("express");
const authController = require("../controllers/authController");
const { validate, registerSchema, loginSchema } = require("../middleware/validator");
const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

module.exports = router;
