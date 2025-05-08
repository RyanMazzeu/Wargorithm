import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { verificarToken } from "../middlewares/auth";

const router = Router();

router.post("/usuarios", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/perfil", verificarToken, userController.getProfile);

export default router;
