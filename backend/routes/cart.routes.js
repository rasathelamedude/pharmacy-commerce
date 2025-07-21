import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getAllCartItems,
  addCartItem,
  updateCartItemQuantity,
  deleteCartItem,
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.get("/", protectRoute, getAllCartItems);
cartRouter.post("/", protectRoute, addCartItem);
cartRouter.patch("/:cartItemId", protectRoute, updateCartItemQuantity);
cartRouter.delete("/", protectRoute, deleteCartItem);

export default cartRouter;
