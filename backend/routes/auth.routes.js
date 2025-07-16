import { Router } from "express";

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/refresh", refreshToken);
authRouter.get("/profile", getProfile);

export default authRouter;