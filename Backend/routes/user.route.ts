import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { verificarToken } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Usuário]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos ou email já usado
 */
router.post("/register", userController.registerUser);
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Faz login de um usuário
 *     tags: [Usuário]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", userController.loginUser);
/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Obtém o perfil do usuário autenticado
 *     tags: [Usuário]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *       401:
 *         description: Token inválido ou não fornecido
 */
router.get("/profile", verificarToken, userController.getProfile);

/**
 * @swagger
 * /update:
 *   put:
 *     summary: Atualiza o perfil do usuário autenticado
 *     tags: [Usuário]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       400:
 *         description: Dados inválidos ou email já usado
 */
router.put("/update", verificarToken, userController.updateProfile);

/**
 * @swagger
 * /delete:
 *   delete:
 *     summary: Deleta o perfil do usuário autenticado
 *     tags: [Usuário]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil deletado com sucesso
 *       401:
 *         description: Token inválido ou não fornecido
 */

router.delete("/delete", verificarToken, userController.deleteProfile);

export default router;
