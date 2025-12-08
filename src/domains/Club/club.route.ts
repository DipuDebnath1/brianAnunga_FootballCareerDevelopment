import { Router } from "express";
import clubController from "./club.controller";

const router = Router();

// Create a new club (public route)
router.post("/", clubController.createClub);

// Update club by ID (public route - consider adding auth middleware for security)
router.put("/:clubId", clubController.updateClub);

// Get club by ID (public route)
router.get("/:clubId", clubController.getClubById);

// Get club by name (public route)
router.get("/name/:name", clubController.getClubByName);

// Get all clubs with optional filters (public route)
router.get("/", clubController.getAllClubs);

// Delete club by ID (public route - consider adding auth middleware for security)
router.delete("/:clubId", clubController.deleteClub);

export default router;
