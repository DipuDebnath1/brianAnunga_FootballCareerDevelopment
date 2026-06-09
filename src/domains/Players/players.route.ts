import { Router } from "express";
import playerController from "./players.controller";
import auth from "../../middlewares/auth";

const router = Router();

// Create player profile (protected route)
router.post("/profile", auth(), playerController.createPlayerProfile);

// Update player profile (protected route)
router.put("/profile", auth(), playerController.updatePlayerProfile);

// Get all players with optional filters (public route)
router.get("/", playerController.getAllPlayers);

export default router;
