import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { RegisterDto, LoginDto } from "./auth.dto";
import { authController } from "./auth.controller";

const router = Router();

// public routes
router.post("/register", validate(RegisterDto), authController.register);
router.post("/login", validate(LoginDto), authController.login);
router.post("/refresh", authController.refresh);

// protected routes — require valid access token
router.post("/logout", authMiddleware, authController.logout);
router.post("/logout-all", authMiddleware, authController.logoutAll);

export default router;
