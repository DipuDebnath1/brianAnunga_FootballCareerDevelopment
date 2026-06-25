import { Router } from "express";
import auth from "../../middlewares/auth";
import userFileUploadMiddleware from "../../middlewares/fileUpload.middleware";
import validationRequest from "../../middlewares/validationRequest";
import { validateUpdateProfile } from "../../middlewares/validateUpdateProfileMiddlewere";
import { ROLE } from "../../utills/roles";
import { UserController } from "./user.controller";
import UserValidation from "./user.validation";

const router = Router();
const fileUpload = userFileUploadMiddleware("uploads/users");

router.get(
  "/",
  auth(ROLE.commonAdmin),
  validationRequest(UserValidation.getAllUsersQuerySchema),
  UserController.getAllUsers
);

router.get(
  "/self/in",
  auth(ROLE.common),
  validationRequest(UserValidation.getSelfProfileQuerySchema),
  UserController.getProfile
);

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
  "/:userId",
  auth(ROLE.common),
  validationRequest(UserValidation.getSingleUserQuerySchema),
  UserController.getSingleUser
);

export default router;
