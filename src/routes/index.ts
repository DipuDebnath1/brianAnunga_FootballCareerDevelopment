import { Router } from "express";
import agentRoutes from "../domains/Agent/agent.route";
import authRoutes from "../domains/Auth/auth.route";
import clubRoutes from "../domains/Club/club.route";
import clubHiringRoutes from "../domains/ClubHiring/clubHiring.route";
import coachRoutes from "../domains/Coach/coach.route";
import conversationRoutes from "../domains/Conversations/conversation.route";
import generalsRoutes from "../domains/Generals/generals.route";
import messageRoutes from "../domains/Messaging/message.route";
import playerConsultationRoutes from "../domains/PlayerConsultation/PlayerConsultation.route";
import playerPlacementRoutes from "../domains/PlayerPlaceRequest/PlayerPlaceRequest.route";
import playersRoutes from "../domains/Players/players.route";
import playerVideoRequestRoutes from "../domains/PlayerVideoRequests/PlayerVideoRequests.route";
import ratingsRoutes from "../domains/Ratings/rating.route";
import userRoutes from "../domains/User/user.route";

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
router.use("/player-placement", playerPlacementRoutes);
router.use("/player-consultation", playerConsultationRoutes);
router.use("/player-video-request", playerVideoRequestRoutes);
router.use("/club-hiring", clubHiringRoutes);

export default router;
