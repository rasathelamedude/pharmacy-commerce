import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  createCheckoutSession,
  checkoutSuccess,
} from "../controllers/payment.controller.js";

const paymentRouter = Router();

paymentRouter.post(
  "/create-checkout-session",
  protectRoute,
  createCheckoutSession
);
paymentRouter.post("/checkout-success", protectRoute, checkoutSuccess);

export default paymentRouter;
