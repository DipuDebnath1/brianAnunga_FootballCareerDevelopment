import { Router } from "express";
import coachController from "./coach.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Create coach profile (protected route)
router.post("/profile", authMiddleware, coachController.createCoachProfile);

// Update coach profile (protected route)
router.put("/profile", authMiddleware, coachController.updateCoachProfile);

// Get coach profile by user ID (protected route)
router.get("/profile", authMiddleware, coachController.getCoachProfile);

// Get all coaches with optional filters (public route)
router.get("/", coachController.getAllCoaches);

export default router;
