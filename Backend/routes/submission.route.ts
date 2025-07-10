import { Router } from "express";
import {
  listAllSubmissions,
  getSubmissionById,
  getMySubmissions,
  getSubmissionsByMatch,
  getMyCorrectSubmissions,
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getSubmissionStats,
  getLastSubmissionInMatch,
} from "../controllers/submission.controller";
import { verificarToken } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /submission:
 *   get:
 *     summary: Lista todas as submissões
 *     tags: [Submission]
 *     responses:
 *       200:
 *         description: Lista de submissões
 */
router.get("/", listAllSubmissions);

/**
 * @swagger
 * /submission/{id}:
 *   get:
 *     summary: Busca submissão por ID
 *     tags: [Submission]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados da submissão
 *       404:
 *         description: Submissão não encontrada
 */
router.get("/:id", getSubmissionById);

/**
 * @swagger
 * /submission/user/my-submissions:
 *   get:
 *     summary: Busca submissões do usuário logado
 *     tags: [Submission]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de submissões do usuário
 */
router.get("/user/my-submissions", verificarToken, getMySubmissions);

/**
 * @swagger
 * /submission/user/correct:
 *   get:
 *     summary: Busca submissões corretas do usuário logado
 *     tags: [Submission]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de submissões corretas do usuário
 */
router.get("/user/correct", verificarToken, getMyCorrectSubmissions);

/**
 * @swagger
 * /submission/match/{matchId}:
 *   get:
 *     summary: Busca submissões de uma partida
 *     tags: [Submission]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de submissões da partida
 */
router.get("/match/:matchId", getSubmissionsByMatch);

/**
 * @swagger
 * /submission/match/{matchId}/last:
 *   get:
 *     summary: Busca última submissão do usuário em uma partida
 *     tags: [Submission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Última submissão do usuário na partida
 *       404:
 *         description: Nenhuma submissão encontrada
 */
router.get("/match/:matchId/last", verificarToken, getLastSubmissionInMatch);

/**
 * @swagger
 * /submission/stats/languages:
 *   get:
 *     summary: Estatísticas de submissões por linguagem
 *     tags: [Submission]
 *     responses:
 *       200:
 *         description: Estatísticas das submissões
 */
router.get("/stats/languages", getSubmissionStats);

/**
 * @swagger
 * /submission:
 *   post:
 *     summary: Cria uma nova submissão
 *     tags: [Submission]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - language
 *               - isCorrect
 *               - matchId
 *             properties:
 *               code:
 *                 type: string
 *               language:
 *                 type: string
 *                 enum: [JAVASCRIPT, PYTHON, JAVA, C, CPP, GO, RUST]
 *               isCorrect:
 *                 type: boolean
 *               matchId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Submissão criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/", verificarToken, createSubmission);

/**
 * @swagger
 * /submission/{id}:
 *   put:
 *     summary: Atualiza uma submissão
 *     tags: [Submission]
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
 *               code:
 *                 type: string
 *               language:
 *                 type: string
 *                 enum: [JAVASCRIPT, PYTHON, JAVA, C, CPP, GO, RUST]
 *               isCorrect:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Submissão atualizada com sucesso
 *       404:
 *         description: Submissão não encontrada
 */
router.put("/:id", verificarToken, updateSubmission);

/**
 * @swagger
 * /submission/{id}:
 *   delete:
 *     summary: Deleta uma submissão
 *     tags: [Submission]
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
 *         description: Submissão deletada com sucesso
 *       404:
 *         description: Submissão não encontrada
 */
router.delete("/:id", verificarToken, deleteSubmission);

export default router;
