import { Router } from "express";
import userRoutes from "../domains/User/user.route";
import authRoutes from "../domains/Auth/auth.route";
import generalsRoutes from "../domains/Generals/generals.route";
import playersRoutes from "../domains/Players/players.route";
import coachRoutes from "../domains/Coach/coach.route";
import agentRoutes from "../domains/Agent/agent.route";
import messageRoutes from "../domains/Messaging/message.route";
import conversationRoutes from "../domains/Conversations/conversation.route";
import ratingsRoutes from "../domains/Ratings/rating.route";
import agentRequestRoutes from "../domains/AgentRequest/agentRequest.route";
import coachVideoRequestRoutes from "../domains/CoachVideoRequest/coachVideoRequest.route";
// Initialize the router
const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/generals", generalsRoutes);
router.use("/players", playersRoutes);
router.use("/coaches", coachRoutes);
router.use("/agents", agentRoutes);
router.use("/conversations", conversationRoutes);
router.use("/messages", messageRoutes);
router.use("/ratings", ratingsRoutes);
router.use("/agent-request", agentRequestRoutes);
router.use("/coach-request", coachVideoRequestRoutes);

export default router;
