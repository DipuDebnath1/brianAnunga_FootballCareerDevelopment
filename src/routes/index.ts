import { Router } from "express";
import userRoutes from "../domains/User/user.route";
import authRoutes from "../domains/Auth/auth.route";
import generalsRoutes from "../domains/Generals/generals.route";
// Initialize the router
const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/generals", generalsRoutes);

export default router;
