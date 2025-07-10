import { Router } from "express";
import {
  listAllHistory,
  getHistoryById,
  getMyHistory,
  getHistoryByMatch,
  getMyVictories,
  createHistory,
  updateHistory,
  deleteHistory,
  getMyStats,
  getTopRanking,
  getMyVictoryCount,
} from "../controllers/match-history.controller";
import { verificarToken } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /history:
 *   get:
 *     summary: Lista todo o histórico (admin)
 *     tags: [MatchHistory]
 *     responses:
 *       200:
 *         description: Lista do histórico de partidas
 */
router.get("/", listAllHistory);

/**
 * @swagger
 * /history/{id}:
 *   get:
 *     summary: Busca histórico por ID
 *     tags: [MatchHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do histórico
 *       404:
 *         description: Histórico não encontrado
 */
router.get("/:id", getHistoryById);

/**
 * @swagger
 * /history/user/my-history:
 *   get:
 *     summary: Busca histórico do usuário logado
 *     tags: [MatchHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista do histórico do usuário
 */
router.get("/user/my-history", verificarToken, getMyHistory);

/**
 * @swagger
 * /history/user/victories:
 *   get:
 *     summary: Busca vitórias do usuário logado
 *     tags: [MatchHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vitórias do usuário
 */
router.get("/user/victories", verificarToken, getMyVictories);

/**
 * @swagger
 * /history/user/stats:
 *   get:
 *     summary: Estatísticas do usuário logado
 *     tags: [MatchHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas de pontuação e vitórias
 */
router.get("/user/stats", verificarToken, getMyStats);

/**
 * @swagger
 * /history/user/victory-count:
 *   get:
 *     summary: Conta vitórias do usuário logado
 *     tags: [MatchHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Número de vitórias do usuário
 */
router.get("/user/victory-count", verificarToken, getMyVictoryCount);

/**
 * @swagger
 * /history/match/{matchId}:
 *   get:
 *     summary: Busca histórico de uma partida
 *     tags: [MatchHistory]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista do histórico da partida
 */
router.get("/match/:matchId", getHistoryByMatch);

/**
 * @swagger
 * /history/ranking/top:
 *   get:
 *     summary: Top ranking global por pontuação
 *     tags: [MatchHistory]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Top ranking de usuários
 */
router.get("/ranking/top", getTopRanking);

/**
 * @swagger
 * /history:
 *   post:
 *     summary: Cria um novo registro de histórico
 *     tags: [MatchHistory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scoreGained
 *               - wasVictory
 *               - userId
 *               - matchId
 *             properties:
 *               scoreGained:
 *                 type: integer
 *               wasVictory:
 *                 type: boolean
 *               userId:
 *                 type: integer
 *               matchId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Histórico criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/", verificarToken, createHistory);

/**
 * @swagger
 * /history/{id}:
 *   put:
 *     summary: Atualiza um registro de histórico
 *     tags: [MatchHistory]
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
 *               scoreGained:
 *                 type: integer
 *               wasVictory:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Histórico atualizado com sucesso
 *       404:
 *         description: Histórico não encontrado
 */
router.put("/:id", verificarToken, updateHistory);

/**
 * @swagger
 * /history/{id}:
 *   delete:
 *     summary: Deleta um registro de histórico
 *     tags: [MatchHistory]
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
 *         description: Histórico deletado com sucesso
 *       404:
 *         description: Histórico não encontrado
 */
router.delete("/:id", verificarToken, deleteHistory);

export default router;
