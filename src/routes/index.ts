import { Router } from "express";
import userRoutes from "../domains/User/user.route";
import authRoutes from "../domains/Auth/auth.route";
import generalsRoutes from "../domains/Generals/generals.route";
import playersRoutes from "../domains/Players/players.route";
import coachRoutes from "../domains/Coach/coach.route";
// Initialize the router
const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/generals", generalsRoutes);
router.use("/players", playersRoutes);
router.use("/coaches", coachRoutes);

export default router;
