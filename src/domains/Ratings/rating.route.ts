import { Router } from "express";
import ratingController from "./rating.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Create a new rating (protected route)
router.post("/", authMiddleware, ratingController.createRating);

// Update a rating by ID (protected route)
router.put("/:ratingId", authMiddleware, ratingController.updateRating);

// Get rating by ID (public route)
router.get("/:ratingId", ratingController.getRatingById);

// Get all ratings for a specific profile (public route)
router.get(
  "/profile/:profileId/:ratingType",
  ratingController.getRatingsByProfile
);

// Get average rating for a specific profile (public route)
router.get(
  "/profile/:profileId/:ratingType/average",
  ratingController.getAverageRatingByProfile
);

// Get all ratings by a specific user (public route)
router.get("/user/:userId", ratingController.getRatingsByUser);

// Delete a rating by ID (protected route)
router.delete("/:ratingId", authMiddleware, ratingController.deleteRating);

// Get all ratings with optional filters (public route)
router.get("/", ratingController.getAllRatings);

export default router;
