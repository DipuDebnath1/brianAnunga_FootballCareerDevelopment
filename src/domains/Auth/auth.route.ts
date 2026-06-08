import { Router } from "express";
import authController from "./auth.controller";
import validate from "../../middlewares/validation.middleware";
import authValidator from "./auth.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/register",
  validate(authValidator.registerValidation),
  authController.register
);

router.post(
  "/verify-email",
  validate(authValidator.verificationValidation),
  authController.verifyEmail
);

router.post(
  "/login",
  validate(authValidator.loginValidation),
  authController.login
);

router.post(
  "/forgot-password",
  validate(authValidator.forgotPasswordValidation),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  validate(authValidator.resetPasswordValidation),
  authController.resetPassword
);

router.post(
  "/change-password",
  authMiddleware,
  validate(authValidator.changePasswordValidation),
  authController.changePassword
);

router.post(
  "/refresh-token",
  validate(authValidator.refreshTokenValidation),
  authController.refreshToken
);

router.post(
  "/resend-verification",
  validate(authValidator.resendVerificationValidation),
  authController.resendVerification
);

router.delete(
  "/delete/:userId",
  authMiddleware,
  authController.deleteUser
);

router.post("/logout", authController.logout);

export default router;
