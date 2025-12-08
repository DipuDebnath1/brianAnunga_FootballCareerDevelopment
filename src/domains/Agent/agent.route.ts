import { Router } from "express";
import agentController from "./agent.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Create agent profile (protected route)
router.post("/profile", authMiddleware, agentController.createAgentProfile);

// Update agent profile (protected route)
router.put("/profile", authMiddleware, agentController.updateAgentProfile);

// Get agent profile by user ID (protected route)
router.get("/profile", authMiddleware, agentController.getAgentProfile);

// Get all agents with optional filters (public route)
router.get("/", agentController.getAllAgents);

export default router;
