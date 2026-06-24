import { Router } from "express";
import validationRequest from "../../middlewares/validationRequest";
import auth from "../../middlewares/auth";
import { AuthController } from "./auth.controller";
import AuthValidation from "./auth.validation";
import { ROLE } from "../../utills/roles";

const router = Router();

router.post(
  "/register",
  validationRequest(AuthValidation.userSignUpValidation),
  AuthController.createUser
);

router.post(
  "/login",
  validationRequest(AuthValidation.userSignInValidation),
  AuthController.LoginUser
);

router.post(
  "/admin_login",
  validationRequest(AuthValidation.userSignInValidation),
  AuthController.LoginAdmin
);

router.post(
  "/login_with_oauth",
  validationRequest(AuthValidation.loginWithOAuthValidation),
  AuthController.LoginWithOAuth
);

router.post(
  "/verify_otp",
  validationRequest(AuthValidation.VerifyOtpValidation),
  AuthController.VerifyOtp
);

router.post(
  "/forgot_password",
  validationRequest(AuthValidation.ForgotPasswordValidation),
  AuthController.ForgotPassword
);

router.post(
  "/reset_password",
  validationRequest(AuthValidation.ResetPasswordValidation),
  AuthController.ResetPassword
);

router.post(
  "/update_password",
  auth(ROLE.common),
  validationRequest(AuthValidation.updatePasswordValidation),
  AuthController.UpdatePassword
);

router.post("/logout", AuthController.LogoutUser);

router.post(
  "/refresh_token",
  validationRequest(AuthValidation.refreshTokenVerification),
  AuthController.RefreshUserToken
);

export default router;
