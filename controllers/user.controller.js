const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/serverConfig.js");
const { SECRET_KEY } = config;
// Creating a new User :
const createuser = async (req, res) => {
  try {
    const { id, name, email, password, phone, role } = req.body;
    if (!name || !email || !password || !phone || !role)
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });

    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });
    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.error("Some error occured while creating the user ", error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role)
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    let user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Email is not valid",
      });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    const isSameRole = user.role === role;
    if (!isSameRole)
      return res.status(400).json({
        success: false,
        message: "Account doesn't exists with the current role",
      });

    const tokenData = { userId: user.id };
    const token = await jwt.sign(tokenData, SECRET_KEY, {
      expiresIn: "1d",
    });
    user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json({ success: true, message: "Login successful", user, token });
  } catch (error) {
    console.error("Some error occured while logging the user in.", error);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token").json({ success: true, message: "Logged out" });
  } catch (error) {
    console.error("Some error occurred while logging the user out.", error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.id;
    let updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (phone) updatedData.phone = phone;

    let user = await User.findByPk(userId);
    if (!user) return res.status(400).json({ message: "User not found" });
    user = await user.update(updatedData, { returning: true });
    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    console.error("Some error occurred while updating the profile.", error);
  }
};

const messageFunctions = {
  createuser,
  login,
  logout,
  updateProfile,
};

module.exports = messageFunctions;
