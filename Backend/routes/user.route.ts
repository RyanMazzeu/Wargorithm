import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { verificarToken } from "../middlewares/auth";

const router = Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/profile", verificarToken, userController.getProfile);

export default router;
