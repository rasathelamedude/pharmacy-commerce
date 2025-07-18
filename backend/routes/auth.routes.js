import { Router } from "express";
import {
  signUp,
  login,
  logout,
  refreshAccessToken,
  getProfile,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/refresh", refreshAccessToken);
authRouter.get("/profile", getProfile);

export default authRouter;
