import { Router } from "express";
import auth from "../../middlewares/auth";
import validationRequest from "../../middlewares/validationRequest";
import { ROLE } from "../../utills/roles";
import { PlayerConsultationController } from "./PlayerConsultation.controller";
import PlayerConsultationValidation from "./PlayerConsultation.validation";

const router = Router();

router.post(
  "/",
  auth(ROLE.player),
  validationRequest(PlayerConsultationValidation.createConsultationValidation),
  PlayerConsultationController.createConsultation
);

router.get(
  "/",
  auth(ROLE.common),
  validationRequest(PlayerConsultationValidation.getConsultationsQueryValidation),
  PlayerConsultationController.getConsultations
);

router.get(
  "/:requestId",
  auth(ROLE.common),
  validationRequest(PlayerConsultationValidation.requestIdParamValidation),
  PlayerConsultationController.getConsultationById
);

router.patch(
  "/:requestId/status",
  auth(ROLE.coach),
  validationRequest(PlayerConsultationValidation.updateConsultationStatusValidation),
  PlayerConsultationController.updateConsultationStatus
);

router.patch(
  "/:requestId/start",
  auth(ROLE.coach),
  validationRequest(PlayerConsultationValidation.requestIdParamValidation),
  PlayerConsultationController.startConsultation
);

router.patch(
  "/:requestId/meeting",
  auth(ROLE.coach),
  validationRequest(PlayerConsultationValidation.updateConsultationMeetingValidation),
  PlayerConsultationController.updateConsultationMeeting
);

router.patch(
  "/:requestId/cancel",
  auth(ROLE.common),
  validationRequest(PlayerConsultationValidation.requestIdParamValidation),
  PlayerConsultationController.cancelConsultation
);

router.patch(
  "/:requestId/complete",
  auth(ROLE.coach),
  validationRequest(PlayerConsultationValidation.completeConsultationValidation),
  PlayerConsultationController.completeConsultation
);

router.post(
  "/:requestId/review",
  auth(ROLE.player),
  validationRequest(PlayerConsultationValidation.addConsultationReviewValidation),
  PlayerConsultationController.addConsultationReview
);

export default router;
