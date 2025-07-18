import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  REFRESH_EXPIRES_IN,
  ACCESS_EXPIRES_IN,
  NODE_ENV,
} from "../lib/env.js";
import jwt from 'jsonwebtoken';

// helper function to generate user tokens;
export const generateTokens = (userId) => {
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });

  const accessToken = jwt.sign({ userId }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });

  return { refreshToken, accessToken };
};

// helper function to set cookies;
export const setCookies = (res, refreshToken, accessToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevents XSS attacks;
    secure: NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attacks;
    maxAge: REFRESH_EXPIRES_IN * 1000, // expires in 7 days;
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevents XSS attacks;
    secure: NODE_ENV === "production",
    sameSite: "strict", // prevents CSRF attacks;
    maxAge: ACCESS_EXPIRES_IN * 1000, // expires in 15 minutes;
  });
};
