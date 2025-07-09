import { Router } from "express";
import {
  getMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
} from "../controllers/message.controller";
import { verificarToken } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /friends/{friendshipId}/messages:
 *   get:
 *     summary: Lista todas as mensagens de uma amizade
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendshipId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da amizade
 *     responses:
 *       200:
 *         description: Lista de mensagens
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso não autorizado
 */
router.get("/friends/:friendshipId/messages", verificarToken, getMessages);

/**
 * @swagger
 * /friends/{friendshipId}/messages:
 *   post:
 *     summary: Envia uma mensagem em uma amizade
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendshipId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da amizade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Texto da mensagem
 *             required:
 *               - content
 *     responses:
 *       201:
 *         description: Mensagem enviada
 *       400:
 *         description: Conteúdo inválido
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso não autorizado
 */
router.post("/friends/:friendshipId/messages", verificarToken, sendMessage);

/**
 * @swagger
 * /friends/{friendshipId}/messages/{messageId}:
 *   put:
 *     summary: Atualiza uma mensagem em uma amizade
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendshipId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da amizade
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da mensagem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Novo texto da mensagem
 *             required:
 *               - content
 *     responses:
 *       200:
 *         description: Mensagem atualizada
 *       400:
 *         description: Conteúdo inválido
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso não autorizado
 *       404:
 *         description: Mensagem não encontrada
 */
router.put(
  "/friends/:friendshipId/messages/:messageId",
  verificarToken,
  updateMessage
);

/**
 * @swagger
 * /friends/{friendshipId}/messages/{messageId}:
 *   delete:
 *     summary: Remove uma mensagem em uma amizade
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendshipId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da amizade
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da mensagem
 *     responses:
 *       204:
 *         description: Mensagem removida
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso não autorizado
 *       404:
 *         description: Mensagem não encontrada
 */
router.delete(
  "/friends/:friendshipId/messages/:messageId",
  verificarToken,
  deleteMessage
);

export default router;
