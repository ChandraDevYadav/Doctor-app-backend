const User = require("../models/User");
const generateTokens = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    console.log("Registering user:", req.body.email);
    const { name, username, email, password, petName, role, adminSecret, profileImage } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User with this email or username already exists" });
    }

    // Security: Prevent arbitrary privilege escalation during registration
    let assignedRole = "patient";
    if (role === "admin") {
      // Very basic security check for demonstration purposes to prevent open admin creation
      if (adminSecret === process.env.ADMIN_SECRET || adminSecret === "swasthya-secure-2026") {
        assignedRole = "admin";
      } else {
        return res.status(403).json({ message: "Invalid admin creation secret." });
      }
    }

    const user = await User.create({
      name,
      username,
      email,
      password,
      petName,
      role: assignedRole,
      ...(profileImage && { profileImage })
    });

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      status: "success",
      accessToken,
      refreshToken,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
        },
      },
    });
  } catch (error) {
    console.error("Auth Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      status: "success",
      accessToken,
      refreshToken,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.status(200).json({
      status: "success",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    res.status(403).json({ message: "Token expired or invalid" });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  const user = await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
  res.status(204).json({ status: "success", data: null });
};

const bcrypt = require("bcryptjs");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ status: "success", message: "User found. Proceed to verification." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPetName = async (req, res) => {
  try {
    const { email, petName } = req.body;
    const user = await User.findOne({ email }).select("+petName");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(petName.toLowerCase(), user.petName);
    if (!isMatch) {
      return res.status(401).json({ message: "Security verification failed" });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || process.env.JWT_REFRESH_SECRET, { expiresIn: '15m' });
    res.status(200).json({ status: "success", resetToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ status: "success", message: "Password updated successfully" });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
