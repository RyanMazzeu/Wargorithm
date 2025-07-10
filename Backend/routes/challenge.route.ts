import { Router } from "express";
import {
  listAllChallenges,
  getChallengeById,
  getChallengesByDifficulty,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getChallengeStats,
} from "../controllers/challenge.controller";
import { verificarToken } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /challenge:
 *   get:
 *     summary: Lista todos os desafios
 *     tags: [Challenge]
 *     responses:
 *       200:
 *         description: Lista de desafios
 */
router.get("/", listAllChallenges);

/**
 * @swagger
 * /challenge/{id}:
 *   get:
 *     summary: Busca desafio por ID
 *     tags: [Challenge]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do desafio
 *       404:
 *         description: Desafio não encontrado
 */
router.get("/:id", getChallengeById);

/**
 * @swagger
 * /challenge/difficulty/{difficulty}:
 *   get:
 *     summary: Busca desafios por dificuldade
 *     tags: [Challenge]
 *     parameters:
 *       - in: path
 *         name: difficulty
 *         required: true
 *         schema:
 *           type: string
 *           enum: [EASY, MEDIUM, HARD]
 *     responses:
 *       200:
 *         description: Lista de desafios da dificuldade especificada
 */
router.get("/difficulty/:difficulty", getChallengesByDifficulty);

/**
 * @swagger
 * /challenge/stats:
 *   get:
 *     summary: Estatísticas de desafios por dificuldade
 *     tags: [Challenge]
 *     responses:
 *       200:
 *         description: Estatísticas dos desafios
 */
router.get("/stats/count", getChallengeStats);

/**
 * @swagger
 * /challenge:
 *   post:
 *     summary: Cria um novo desafio
 *     tags: [Challenge]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - input
 *               - expectedOutput
 *               - difficulty
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               input:
 *                 type: string
 *               expectedOutput:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [EASY, MEDIUM, HARD]
 *     responses:
 *       201:
 *         description: Desafio criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/", verificarToken, createChallenge);

/**
 * @swagger
 * /challenge/{id}:
 *   put:
 *     summary: Atualiza um desafio
 *     tags: [Challenge]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               input:
 *                 type: string
 *               expectedOutput:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [EASY, MEDIUM, HARD]
 *     responses:
 *       200:
 *         description: Desafio atualizado com sucesso
 *       404:
 *         description: Desafio não encontrado
 */
router.put("/:id", verificarToken, updateChallenge);

/**
 * @swagger
 * /challenge/{id}:
 *   delete:
 *     summary: Deleta um desafio
 *     tags: [Challenge]
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
 *         description: Desafio deletado com sucesso
 *       404:
 *         description: Desafio não encontrado
 */
router.delete("/:id", verificarToken, deleteChallenge);

export default router;
