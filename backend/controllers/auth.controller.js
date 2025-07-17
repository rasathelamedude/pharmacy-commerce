import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  REFRESH_EXPIRES_IN,
  ACCESS_EXPIRES_IN,
  NODE_ENV,
} from "../lib/env.js";

export const signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("User already exists.");
    }

    const user = await User.create({ email, password, name });

    const { refreshToken, accessToken } = generateTokens(user._id);

    setCookies(res, refreshToken, accessToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status().json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {};

export const logout = async (req, res) => {};

export const refreshToken = async (req, res) => {};

export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

// helper function to generate user tokens;
const generateTokens = (userId) => {
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });

  const accessToken = jwt.sign({ userId }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });

  return { refreshToken, accessToken };
};

// helper function to set cookies;
const setCookies = (res, refreshToken, accessToken) => {
  res.cookie("", refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attacks;
    maxAge: REFRESH_EXPIRES_IN * 1000,
  });
};
