import { Router } from "express";
import auth from "../../middlewares/auth";
import fileUploader from "../../middlewares/fileUploader";
import validationRequest from "../../middlewares/validationRequest";
import { ROLE } from "../../utills/roles";
import { PlayerPlaceRequestController } from "./PlayerPlaceRequest.controller";
import PlayerPlaceRequestValidation from "./PlayerPlaceRequest.validation";

const fileUpload = fileUploader("player-placement");
const router = Router();

router.post(
  "/",
  auth(ROLE.player),
  fileUpload.fields([{ name: "resume", maxCount: 1 }]),
  validationRequest(PlayerPlaceRequestValidation.createPlacementValidation),
  PlayerPlaceRequestController.createPlacement
);

router.get(
  "/",
  auth(ROLE.common),
  validationRequest(PlayerPlaceRequestValidation.getPlacementsQueryValidation),
  PlayerPlaceRequestController.getPlacements
);

router.get(
  "/:requestId",
  auth(ROLE.common),
  validationRequest(PlayerPlaceRequestValidation.requestIdParamValidation),
  PlayerPlaceRequestController.getPlacementById
);

router.patch(
  "/:requestId/status",
  auth(ROLE.agents),
  validationRequest(PlayerPlaceRequestValidation.updatePlacementStatusValidation),
  PlayerPlaceRequestController.updatePlacementStatus
);

export default router;
