import { Router } from "express";
import agentRequestController from "./agentRequest.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Create agent request (protected route)
router.post("/", authMiddleware, agentRequestController.createAgentRequest);

// Get agent requests by agent_id (protected route)
router.get("/agent/:agentId", authMiddleware, agentRequestController.getAgentRequestsByAgentId);

// Get agent requests by user_id (protected route)
router.get("/user", authMiddleware, agentRequestController.getAgentRequestsByUserId);

// Update agent request status (protected route)
router.put("/:id/status", authMiddleware, agentRequestController.updateAgentRequestStatus);

// Get all agent requests with optional filters (protected route, likely for admin)
router.get("/", authMiddleware, agentRequestController.getAllAgentRequests);

// Get single agent request by ID (protected route)
router.get("/:id", authMiddleware, agentRequestController.getAgentRequestById);

export default router;