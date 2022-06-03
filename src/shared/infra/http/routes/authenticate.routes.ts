import { Router } from "express";

import { AuthenticateUserController } from "@modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { ForgotPasswordController } from "@modules/accounts/useCases/forgotPassword/ForgotPasswordController";
import { RefreshTokenController } from "@modules/accounts/useCases/refreshToken/RefreshTokenController";
import { ResetPasswordController } from "@modules/accounts/useCases/resetPassword/ResetPasswordController";

const authenticateRoutes = Router();
const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

authenticateRoutes.post("/sessions", authenticateUserController.handle);
authenticateRoutes.post("/refresh-token", refreshTokenController.handle);
authenticateRoutes.post("/forgot-pass", forgotPasswordController.handle);
authenticateRoutes.post("/reset-pass", resetPasswordController.handle);

export { authenticateRoutes };
