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

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error("Unauthrized");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const adminRoute = (req, res, next) => {};
