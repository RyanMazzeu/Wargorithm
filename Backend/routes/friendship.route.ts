import { Router } from "express";
import {
  sendFriendRequest,
  getIncomingRequests,
  getSentRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelSentRequest,
  listFriends,
  unfriend,
  checkRelationship,
} from "../controllers/friend-request.controller";
import { verificarToken } from "../middlewares/auth";

/**
 * Express router for handling friend request related endpoints.
 *
 * @swagger
 * tags:
 *   - name: FriendShips
 *     description: API endpoints for managing friend requests
 */
const router = Router();

/**
 * @swagger
 * /friends/requests:
 *   post:
 *     summary: Envia uma solicitação de amizade para outro usuário
 *     tags: [FriendShips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: number
 *                 description: ID do usuário que receberá a solicitação
 *             required:
 *               - recipientId
 *     responses:
 *       200:
 *         description: Solicitação de amizade enviada com sucesso
 *       400:
 *         description: Dados inválidos ou solicitação já existente
 *       401:
 *         description: Não autorizado
 */
router.post("/requests", verificarToken, sendFriendRequest);

/**
 * @swagger
 * /friends/requests/incoming:
 *   get:
 *     summary: Lista as solicitações de amizade recebidas
 *     tags: [FriendShips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitações recebidas
 *       401:
 *         description: Não autorizado
 */
router.get("/requests/incoming", verificarToken, getIncomingRequests);

/**
 * @swagger
 * /friends/requests/sent:
 *   get:
 *     summary: Lista as solicitações de amizade enviadas
 *     tags: [FriendShips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitações enviadas
 *       401:
 *         description: Não autorizado
 */
router.get("/requests/sent", verificarToken, getSentRequests);

/**
 * @swagger
 * /friends/requests/{requestId}/accept:
 *   post:
 *     summary: Aceita uma solicitação de amizade
 *     tags: [FriendShips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da solicitação de amizade
 *     responses:
 *       200:
 *         description: Solicitação aceita com sucesso
 *       400:
 *         description: Solicitação inválida
 *       401:
 *         description: Não autorizado
 */
router.post("/requests/:requestId/accept", verificarToken, acceptFriendRequest);

/**
 * @swagger
 * /friends/requests/{requestId}/reject:
 *   post:
 *     summary: Rejeita uma solicitação de amizade
 *     tags: [FriendShips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da solicitação de amizade
 *     responses:
 *       200:
 *         description: Solicitação rejeitada com sucesso
 *       400:
 *         description: Solicitação inválida
 *       401:
 *         description: Não autorizado
 */
router.post("/requests/:requestId/reject", verificarToken, rejectFriendRequest);

/**
 * @swagger
 * /friends/requests/{requestId}:
 *   delete:
 *     summary: Cancela uma solicitação de amizade enviada
 *     tags: [FriendShips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da solicitação de amizade
 *     responses:
 *       200:
 *         description: Solicitação cancelada com sucesso
 *       400:
 *         description: Solicitação inválida
 *       401:
 *         description: Não autorizado
 */
router.delete("/requests/:requestId", verificarToken, cancelSentRequest);

// --- Rotas para Amizades ---

/**
 * @swagger
 * /friends:
 *   get:
 *     summary: Lista todos os amigos do usuário autenticado
 *     tags: [FriendShips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de amigos
 *       401:
 *         description: Não autorizado
 */
router.get("/", verificarToken, listFriends);

/**
 * @swagger
 * /friends/{friendId}:
 *   delete:
 *     summary: Remove um amigo (unfriend)
 *     tags: [FriendShips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do amigo a ser removido
 *     responses:
 *       200:
 *         description: Amizade removida com sucesso
 *       400:
 *         description: Solicitação inválida
 *       401:
 *         description: Não autorizado
 */
router.delete("/:friendId", verificarToken, unfriend);

/**
 * @swagger
 * /friends/status/{otherUserId}:
 *   get:
 *     summary: Checa o status de amizade com outro usuário
 *     tags: [FriendShips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: otherUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do outro usuário
 *     responses:
 *       200:
 *         description: Status de amizade retornado com sucesso
 *       401:
 *         description: Não autorizado
 */
router.get("/status/:otherUserId", verificarToken, checkRelationship);

export default router;
