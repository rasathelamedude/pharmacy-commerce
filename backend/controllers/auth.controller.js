import User from "../models/user.model.js";
import { generateTokens, setCookies } from "../utils/auth.utils.js";
import jwt from "jsonwebtoken";
import {
  JWT_REFRESH_SECRET,
  JWT_ACCESS_SECRET,
  ACCESS_EXPIRES_IN,
} from "../lib/env.js";

export const signUp = async (req, res) => {
  try {
    // Get user data;
    const { email, password, name } = req.body;

    // Check if user already exists;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("User already exists.");
    }

    // Create user;
    const user = await User.create({ email, password, name });

    // Generate tokens;
    const { refreshToken, accessToken } = generateTokens(user._id);

    // Set cookies for tokens;
    setCookies(res, refreshToken, accessToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status().json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    // Get user data;
    const { email, password } = req.body;

    // Fetch user from DB;
    const user = await User.findOne({ email });

    // Check if it exists;
    if (!user) {
      throw new Error("User doesn't exist");
    }

    // Check if password is valid;
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error("Password invalid!");
    }

    // Generate tokens;
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Set cookies for tokens;
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to login user",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    // TODO: Implement caching;

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.status(200).json({
      success: true,
      message: "User logged out successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to logout user",
      error: error.message,
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    // TODO: Implmenet the following with redis;
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error("Refresh token invalid!");
    }

    const accessToken = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, {
      expiresIn: ACCESS_EXPIRES_IN,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ACCESS_EXPIRES_IN * 1000,
    });

    res.status().json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Failed refreshing access token",
      error: error.message,
    });
  }
};

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
