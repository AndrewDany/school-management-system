const bcrypt = require("bcryptjs");
const { User, Student, ClassSection } = require("../models");
const { signToken } = require("../utils/jwt");

// Only admins should be able to create teacher/admin accounts in production;
// for now this is open for initial setup — restrict later with a middleware.
async function register(req, res) {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "fullName, email and password are required" });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      role: role || "student",
    });
    const token = signToken(user);
    return res.status(201).json({
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error during registration" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = signToken(user);
    return res.json({
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error during login" });
  }
}

async function me(req, res) {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["passwordHash"] },
    include: [
      {
        model: Student,
        as: "studentProfile",
        include: [{ model: ClassSection, as: "classSection" }],
      },
      {
        model: ClassSection,
        as: "classesTaught",
      },
    ],
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user);
}

module.exports = { register, login, me };
