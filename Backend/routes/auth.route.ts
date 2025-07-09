/**
 * @module AuthRoutes
 * @description
 * Roteador Express para endpoints de autenticação.
 *
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints para autenticação de usuários
 */

import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerUser);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Auth]
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
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Entrada inválida
 */
router.post("/login", loginUser);
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Fazer login de um usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: abc@1
 *               password:
 *                 type: string
 *                 example: 123456
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Usuário logado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */

export default router;
