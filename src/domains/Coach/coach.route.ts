import { Router } from "express";
import coachController from "./coach.controller";
import auth from "../../middlewares/auth";

const router = Router();

// Create coach profile (protected route)
router.post("/profile", auth(), coachController.createCoachProfile);

// Update coach profile (protected route)
router.put("/profile", auth(), coachController.updateCoachProfile);

// Get coach profile by user ID (protected route)
router.get("/profile", auth(), coachController.getCoachProfile);

// Get all coaches with optional filters (public route)
router.get("/", coachController.getAllCoaches);

export default router;
