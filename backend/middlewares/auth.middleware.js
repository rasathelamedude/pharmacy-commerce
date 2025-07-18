import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../lib/env.js";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      throw new Error("Unauthrized");
    }

    const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new Error("Unauthrized");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const adminRoute = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      throw new Error("Unauthrized | access token not found!");
    }

    let decoded;
    try {
      decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET);
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token!" });
    }

    if (!decoded?.userId) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload!" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found!",
      });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied | Admins only." });
    }

    next();
  } catch (error) {
    next(error);
  }
};
