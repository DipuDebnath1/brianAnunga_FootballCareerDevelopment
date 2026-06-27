import { Router } from "express";
import auth from "../../middlewares/auth";
import fileUploader from "../../middlewares/fileUploader";
import { validateUpdateProfile } from "../../middlewares/validateUpdateProfileMiddlewere";
import { ROLE } from "../../utills/roles";
import { UserController } from "./user.controller";

const fileUpload = fileUploader('users');
const router = Router();


router.patch(
  "/self/image",
  auth(ROLE.common),
  fileUpload.single("image"),
  UserController.updateUserImage
);

router.patch(
  "/self/update",
  auth(ROLE.common),
  validateUpdateProfile(),
  UserController.updateProfile
);

router.get(
  "/coaches",
  auth(ROLE.common),
  UserController.allCoachesForPlayers
);

router.get(
  "/agents",
  auth(ROLE.common),
  UserController.allAgentsForPlayers
);

router.get(
  "/coaches/:id",
  auth(ROLE.common),
  UserController.coachProfile
);

router.get(
  "/agents/:id",
  auth(ROLE.common),
  UserController.agentProfile
);
export default router;
