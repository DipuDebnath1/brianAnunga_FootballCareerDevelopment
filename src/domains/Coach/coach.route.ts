import { Router } from "express";
import auth from "../../middlewares/auth";
import validationRequest from "../../middlewares/validationRequest";
import { ROLE } from "../../utills/roles";
import { CoachController } from "./coach.controller";
import CoachValidation from "./coach.validation";

const router = Router();

router.get(
  "/time-slots",
  auth(ROLE.coach),
  validationRequest(CoachValidation.getTimeSlotsQueryValidation),
  CoachController.getTimeSlots
);

router.get(
  "/time-slots/:slotId",
  auth(ROLE.coach),
  validationRequest(CoachValidation.timeSlotIdParamValidation),
  CoachController.getTimeSlotById
);

router.post(
  "/time-slots",
  auth(ROLE.coach),
  validationRequest(CoachValidation.createTimeSlotValidation),
  CoachController.createTimeSlot
);

router.patch(
  "/time-slots/:slotId",
  auth(ROLE.coach),
  validationRequest(CoachValidation.updateTimeSlotValidation),
  CoachController.updateTimeSlot
);

router.delete(
  "/time-slots/:slotId",
  auth(ROLE.coach),
  validationRequest(CoachValidation.timeSlotIdParamValidation),
  CoachController.deleteTimeSlot
);

export default router;
