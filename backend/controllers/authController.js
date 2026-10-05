const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { User } = require("../models");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { fullName, email, password, role, shopName } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Full name, email and password are required" });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role === "seller" ? "seller" : "buyer",
      shopName: role === "seller" ? shopName : null,
      avatar,
    });

    const token = generateToken(user.id);
    res.status(201).json({
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
const getProfile = async (req, res) => {
  res.json(req.user);
};

// PUT /api/auth/me
const updateProfile = async (req, res) => {
  try {
    const fields = ["fullName", "phone", "zipCode", "address1", "address2"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) req.user[f] = req.body[f];
    });
    if (req.file) req.user.avatar = `/uploads/${req.file.filename}`;
    await req.user.save();
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    // Always respond the same way whether or not the email exists, to avoid leaking which emails are registered.
    if (!user) return res.json({ message: "If an account exists for this email, a reset link has been sent." });

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your ShopO password",
      html: `<p>Click the link below to reset your password. This link expires in 1 hour.</p>
             <p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
    res.json({
      message: smtpConfigured
        ? "If an account exists for this email, a reset link has been sent."
        : "Email isn't configured yet, so here's your reset link directly (also logged on the server).",
      // Only returned when SMTP isn't set up, so local/dev testing doesn't require a real mailbox.
      devResetUrl: smtpConfigured ? undefined : resetUrl,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      where: { resetPasswordToken: hashedToken },
    });
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: "Reset link is invalid or has expired" });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { signup, login, getProfile, updateProfile, forgotPassword, resetPassword };
