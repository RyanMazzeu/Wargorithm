import { Router } from "express";
import {
  listAllNotifications,
  getNotificationById,
  getMyNotifications,
  getMyUnreadNotifications,
  getUnreadCount,
  createNotification,
  markAsRead,
  markAllAsRead,
  updateNotification,
  deleteNotification,
  cleanOldNotifications,
} from "../controllers/notification.controller";
import { verificarToken } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /notification:
 *   get:
 *     summary: Lista todas as notificações (admin)
 *     tags: [Notification]
 *     responses:
 *       200:
 *         description: Lista de notificações
 */
router.get("/", listAllNotifications);

/**
 * @swagger
 * /notification/{id}:
 *   get:
 *     summary: Busca notificação por ID
 *     tags: [Notification]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados da notificação
 *       404:
 *         description: Notificação não encontrada
 */
router.get("/:id", getNotificationById);

/**
 * @swagger
 * /notification/user/my-notifications:
 *   get:
 *     summary: Busca notificações do usuário logado
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificações do usuário
 */
router.get("/user/my-notifications", verificarToken, getMyNotifications);

/**
 * @swagger
 * /notification/user/unread:
 *   get:
 *     summary: Busca notificações não lidas do usuário logado
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificações não lidas
 */
router.get("/user/unread", verificarToken, getMyUnreadNotifications);

/**
 * @swagger
 * /notification/user/unread-count:
 *   get:
 *     summary: Conta notificações não lidas do usuário
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Número de notificações não lidas
 */
router.get("/user/unread-count", verificarToken, getUnreadCount);

/**
 * @swagger
 * /notification:
 *   post:
 *     summary: Cria uma nova notificação
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - userId
 *             properties:
 *               message:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Notificação criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/", verificarToken, createNotification);

/**
 * @swagger
 * /notification/{id}/read:
 *   put:
 *     summary: Marca notificação como lida
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notificação marcada como lida
 *       404:
 *         description: Notificação não encontrada
 */
router.put("/:id/read", verificarToken, markAsRead);

/**
 * @swagger
 * /notification/user/mark-all-read:
 *   put:
 *     summary: Marca todas as notificações do usuário como lidas
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Todas as notificações marcadas como lidas
 */
router.put("/user/mark-all-read", verificarToken, markAllAsRead);

/**
 * @swagger
 * /notification/{id}:
 *   put:
 *     summary: Atualiza uma notificação
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               isRead:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notificação atualizada com sucesso
 *       404:
 *         description: Notificação não encontrada
 */
router.put("/:id", verificarToken, updateNotification);

/**
 * @swagger
 * /notification/{id}:
 *   delete:
 *     summary: Deleta uma notificação
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notificação deletada com sucesso
 *       404:
 *         description: Notificação não encontrada
 */
router.delete("/:id", verificarToken, deleteNotification);

/**
 * @swagger
 * /notification/clean/old:
 *   delete:
 *     summary: Remove notificações antigas (mais de 30 dias e lidas)
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notificações antigas removidas
 */
router.delete("/clean/old", verificarToken, cleanOldNotifications);

export default router;
