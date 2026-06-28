import { Router } from "express";
import auth from "../../middlewares/auth";
import validationRequest from "../../middlewares/validationRequest";
import { ROLE } from "../../utills/roles";
import { PlayerVideoRequestsController } from "./PlayerVideoRequests.controller";
import PlayerVideoRequestsValidation from "./PlayerVideoRequests.validation";

const router = Router();

router.post(
  "/",
  auth(ROLE.player),
  validationRequest(PlayerVideoRequestsValidation.createVideoRequestValidation),
  PlayerVideoRequestsController.createVideoRequest
);

router.get(
  "/",
  auth(ROLE.common),
  validationRequest(PlayerVideoRequestsValidation.getVideoRequestsQueryValidation),
  PlayerVideoRequestsController.getVideoRequests
);

router.get(
  "/:requestId",
  auth(ROLE.common),
  validationRequest(PlayerVideoRequestsValidation.requestIdParamValidation),
  PlayerVideoRequestsController.getVideoRequestById
);

router.patch(
  "/:requestId/status",
  auth(ROLE.coach),
  validationRequest(PlayerVideoRequestsValidation.updateRequestStatusValidation),
  PlayerVideoRequestsController.updateRequestStatus
);

router.patch(
  "/:requestId/cancel",
  auth(ROLE.common),
  validationRequest(PlayerVideoRequestsValidation.requestIdParamValidation),
  PlayerVideoRequestsController.cancelVideoRequest
);

router.patch(
  "/:requestId/complete",
  auth(ROLE.coach),
  validationRequest(PlayerVideoRequestsValidation.completeVideoRequestValidation),
  PlayerVideoRequestsController.completeVideoRequest
);

router.post(
  "/:requestId/review",
  auth(ROLE.player),
  validationRequest(PlayerVideoRequestsValidation.addVideoReviewValidation),
  PlayerVideoRequestsController.addVideoReview
);

export default router;
