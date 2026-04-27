import { generateToken } from "../utils/generateToken.js";
import { User } from "../models/User.js";

const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPasswordStrongEnough = (password) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(password);

const sanitizeUser = (user) => ({
  id: String(user._id),
  fullName: user.fullName,
  email: user.email,
  createdAt: user.createdAt,
});

export const signup = async (req, res, next) => {
  try {
    const { fullName = "", email = "", password = "" } = req.body;

    if (!fullName.trim()) {
      res.status(400);
      throw new Error("Full name is required");
    }

    if (!isEmailValid(email)) {
      res.status(400);
      throw new Error("Please provide a valid email address");
    }

    if (!isPasswordStrongEnough(password)) {
      res.status(400);
      throw new Error("Password must be at least 8 characters and include letters and numbers");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      res.status(409);
      throw new Error("An account with this email already exists");
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    return res.status(201).json({
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email = "", password = "" } = req.body;

    if (!isEmailValid(email) || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user) {
      res.status(401);
      throw new Error("Incorrect email or password");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401);
      throw new Error("Incorrect email or password");
    }

    return res.status(200).json({
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = async (req, res) => {
  res.status(200).json({
    user: sanitizeUser(req.user),
  });
};
