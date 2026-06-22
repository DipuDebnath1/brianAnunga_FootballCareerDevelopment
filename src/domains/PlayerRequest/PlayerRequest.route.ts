import { Router } from "express";
import agentRequestController from "./PlayerRequest.controller";
import auth from "../../middlewares/auth";

const router = Router();

// Create agent request (protected route)
router.post("/", auth(), agentRequestController.createAgentRequest);

// Get agent requests by agent_id (protected route)
router.get("/agent/:agentId", auth(), agentRequestController.getAgentRequestsByAgentId);

// Get agent requests by user_id (protected route)
router.get("/user", auth(), agentRequestController.getAgentRequestsByUserId);

// Update agent request status (protected route)
router.put("/:id/status", auth(), agentRequestController.updateAgentRequestStatus);

// Get all agent requests with optional filters (protected route, likely for admin)
router.get("/", auth(), agentRequestController.getAllAgentRequests);

// Get single agent request by ID (protected route)
router.get("/:id", auth(), agentRequestController.getAgentRequestById);

export default router;