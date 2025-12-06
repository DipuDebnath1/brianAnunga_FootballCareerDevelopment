import { Router } from "express";
import playerController from "./players.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Create player profile (protected route)
router.post("/profile", authMiddleware, playerController.createPlayerProfile);

// Update player profile (protected route)
router.put("/profile", authMiddleware, playerController.updatePlayerProfile);

// Get all players with optional filters (public route)
router.get("/", playerController.getAllPlayers);

export default router;
