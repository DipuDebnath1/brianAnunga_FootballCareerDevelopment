import { Router } from "express";
import agentController from "./agent.controller";
import auth from "../../middlewares/auth";

const router = Router();

// Create agent profile (protected route)
router.post("/profile", auth(), agentController.createAgentProfile);

// Update agent profile (protected route)
router.put("/profile", auth(), agentController.updateAgentProfile);

// Get agent profile by user ID (protected route)
router.get("/profile", auth(), agentController.getAgentProfile);

// Get all agents with optional filters (public route)
router.get("/", agentController.getAllAgents);

export default router;
