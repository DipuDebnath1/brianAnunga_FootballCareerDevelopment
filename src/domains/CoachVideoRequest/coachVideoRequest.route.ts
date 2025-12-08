import { Router } from "express";
import coachVideoRequestController from "./CoachVideoRequest.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Create coach video request (protected route)
router.post(
  "/",
  authMiddleware,
  coachVideoRequestController.createCoachVideoRequest
);

// Get coach video requests by coach_id (protected route)
router.get(
  "/coach/:coachId",
  authMiddleware,
  coachVideoRequestController.getCoachVideoRequestsByCoachId
);

// Get coach video requests by user_id (protected route)
router.get(
  "/user",
  authMiddleware,
  coachVideoRequestController.getCoachVideoRequestsByUserId
);

// Update coach video request status (protected route)
router.put(
  "/:id/status",
  authMiddleware,
  coachVideoRequestController.updateCoachVideoRequestStatus
);

// Update coach video request with feedback (protected route)
router.put(
  "/:id/feedback",
  authMiddleware,
  coachVideoRequestController.updateCoachVideoRequestFeedback
);

// Get all coach video requests with optional filters (protected route, likely for admin)
router.get(
  "/",
  authMiddleware,
  coachVideoRequestController.getAllCoachVideoRequests
);

// Get single coach video request by ID (protected route)
router.get(
  "/:id",
  authMiddleware,
  coachVideoRequestController.getCoachVideoRequestById
);

export default router;
