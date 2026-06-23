import { Router } from "express";
import clubRoutes from "../domains/Club/club.route";
import userRoutes from "../domains/User/user.route";
import authRoutes from "../domains/Auth/auth.route";
import generalsRoutes from "../domains/Generals/generals.route";
import playersRoutes from "../domains/Players/players.route";
import coachRoutes from "../domains/Coach/coach.route";
import agentRoutes from "../domains/Agent/agent.route";
import messageRoutes from "../domains/Messaging/message.route";
import conversationRoutes from "../domains/Conversations/conversation.route";
import ratingsRoutes from "../domains/Ratings/rating.route";
import playerRequestRoutes from "../domains/PlayerRequest/PlayerRequest.route";
import playerConsultationRoutes from "../domains/PlayerConsultation/PlayerConsultation.route";
import playerVideoRequestRoutes from "../domains/PlayerVideoRequests/PlayerVideoRequests.route";
import clubHiringRoutes from "../domains/ClubHiring/clubHiring.route";

const router = Router();

router.use("/clubs", clubRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/generals", generalsRoutes);
router.use("/players", playersRoutes);
router.use("/coaches", coachRoutes);
router.use("/agents", agentRoutes);
router.use("/conversations", conversationRoutes);
router.use("/messages", messageRoutes);
router.use("/ratings", ratingsRoutes);
router.use("/player-request", playerRequestRoutes);
router.use("/player-consultation", playerConsultationRoutes);
router.use("/player-video-request", playerVideoRequestRoutes);
router.use("/club-hiring", clubHiringRoutes);

export default router;
