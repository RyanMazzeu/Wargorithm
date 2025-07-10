import { Router } from "express";
import {
  listAllMatches,
  getMatchById,
  getMatchesByUser,
  getMatchesInProgress,
  createMatch,
  finishMatch,
  cancelMatch,
  deleteMatch,
  getMatchStats,
} from "../controllers/match.controller";
import { verificarToken } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /match:
 *   get:
 *     summary: Lista todas as partidas
 *     tags: [Match]
 *     responses:
 *       200:
 *         description: Lista de partidas
 */
router.get("/", listAllMatches);

/**
 * @swagger
 * /match/{id}:
 *   get:
 *     summary: Busca partida por ID
 *     tags: [Match]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados da partida
 *       404:
 *         description: Partida não encontrada
 */
router.get("/:id", getMatchById);

/**
 * @swagger
 * /match/user/my-matches:
 *   get:
 *     summary: Busca partidas do usuário logado
 *     tags: [Match]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de partidas do usuário
 */
router.get("/user/my-matches", verificarToken, getMatchesByUser);

/**
 * @swagger
 * /match/status/in-progress:
 *   get:
 *     summary: Busca partidas em andamento
 *     tags: [Match]
 *     responses:
 *       200:
 *         description: Lista de partidas em andamento
 */
router.get("/status/in-progress", getMatchesInProgress);

/**
 * @swagger
 * /match/stats/count:
 *   get:
 *     summary: Estatísticas de partidas por status
 *     tags: [Match]
 *     responses:
 *       200:
 *         description: Estatísticas das partidas
 */
router.get("/stats/count", getMatchStats);

/**
 * @swagger
 * /match:
 *   post:
 *     summary: Cria uma nova partida
 *     tags: [Match]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playerBId
 *               - challengeId
 *             properties:
 *               playerBId:
 *                 type: integer
 *               challengeId:
 *                 type: integer
 *               durationSeconds:
 *                 type: integer
 *                 default: 1800
 *     responses:
 *       201:
 *         description: Partida criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/", verificarToken, createMatch);

/**
 * @swagger
 * /match/{id}/finish:
 *   put:
 *     summary: Finaliza uma partida
 *     tags: [Match]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               winnerId:
 *                 type: integer
 *               durationSeconds:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Partida finalizada com sucesso
 *       404:
 *         description: Partida não encontrada
 */
router.put("/:id/finish", verificarToken, finishMatch);

/**
 * @swagger
 * /match/{id}/cancel:
 *   put:
 *     summary: Cancela uma partida
 *     tags: [Match]
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
 *         description: Partida cancelada com sucesso
 *       404:
 *         description: Partida não encontrada
 */
router.put("/:id/cancel", verificarToken, cancelMatch);

/**
 * @swagger
 * /match/{id}:
 *   delete:
 *     summary: Deleta uma partida
 *     tags: [Match]
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
 *         description: Partida deletada com sucesso
 *       404:
 *         description: Partida não encontrada
 */
router.delete("/:id", verificarToken, deleteMatch);

export default router;
