import { Router } from "express";
import {
  listAllUsers,
  updateProfile,
  updatePassword,
  deleteProfile,
} from "../controllers/user.controller";
import { verificarToken } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuário]
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get("/", listAllUsers);

/**
 * @swagger
 * /user/update-profile:
 *   put:
 *     summary: Atualiza o nome e a foto do usuário autenticado
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
 *               photo:
 *                 type: string
 *             example:
 *               name: João da Silva
 *               photo: https://example.com/avatar.jpg
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       400:
 *         description: Nada para atualizar ou dados inválidos
 */
router.put("/update-profile", verificarToken, updateProfile);

/**
 * @swagger
 * /user/update-password:
 *   put:
 *     summary: Atualiza a senha do usuário autenticado
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
 *               password:
 *                 type: string
 *             example:
 *               password: novaSenhaSegura123
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *       400:
 *         description: Senha inválida
 */
router.put("/update-password", verificarToken, updatePassword);

/**
 * @swagger
 * /user/delete:
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
router.delete("/delete", verificarToken, deleteProfile);

export default router;