import { Router } from "express";
import coachVideoRequestController from "./PlayerVideoRequests.controller";
import auth from "../../middlewares/auth";

const router = Router();

// Create coach video request (protected route)
router.post(
  "/",
  auth(),
  coachVideoRequestController.createCoachVideoRequest
);

// Get coach video requests by coach_id (protected route)
router.get(
  "/coach/:coachId",
  auth(),
  coachVideoRequestController.getCoachVideoRequestsByCoachId
);

// Get coach video requests by user_id (protected route)
router.get(
  "/user",
  auth(),
  coachVideoRequestController.getCoachVideoRequestsByUserId
);

// Update coach video request status (protected route)
router.put(
  "/:id/status",
  auth(),
  coachVideoRequestController.updateCoachVideoRequestStatus
);

// Update coach video request with feedback (protected route)
router.put(
  "/:id/feedback",
  auth(),
  coachVideoRequestController.updateCoachVideoRequestFeedback
);

// Get all coach video requests with optional filters (protected route, likely for admin)
router.get(
  "/",
  auth(),
  coachVideoRequestController.getAllCoachVideoRequests
);

// Get single coach video request by ID (protected route)
router.get(
  "/:id",
  auth(),
  coachVideoRequestController.getCoachVideoRequestById
);

export default router;
