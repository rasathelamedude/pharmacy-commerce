import { Router } from "express";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";
import {
  getAllMedications,
  getFeaturedMedications,
  getRecommendedMedications,
  getCategoryMedications,
  createMedication,
  toggleFeatureMedication,
  deleteMedication,
} from "../controllers/medication.controller.js";

const medicationRouter = Router();

medicationRouter.get("/", protectRoute, adminRoute, getAllMedications);
medicationRouter.get("/featured-medications", getFeaturedMedications);
medicationRouter.get("/category/:categoryName", getCategoryMedications);
medicationRouter.get("/recommended-medications", getRecommendedMedications);

medicationRouter.post("/", protectRoute, adminRoute, createMedication);

medicationRouter.patch(
  "/:medicationId",
  protectRoute,
  adminRoute,
  toggleFeatureMedication
);

medicationRouter.delete(
  "/:medicationId",
  protectRoute,
  adminRoute,
  deleteMedication
);

export default medicationRouter;
