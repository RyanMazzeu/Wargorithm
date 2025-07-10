import { Router } from "express";
import {
  listAllFeedbacks,
  getFeedbackById,
  getFeedbacksByChallenge,
  getMyFeedbacks,
  checkUserFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getChallengeAverageRating,
  getFeedbacksByRating,
} from "../controllers/challenge-feedback.controller";
import { verificarToken } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Lista todos os feedbacks
 *     tags: [ChallengeFeedback]
 *     responses:
 *       200:
 *         description: Lista de feedbacks
 */
router.get("/", listAllFeedbacks);

/**
 * @swagger
 * /feedback/{id}:
 *   get:
 *     summary: Busca feedback por ID
 *     tags: [ChallengeFeedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do feedback
 *       404:
 *         description: Feedback não encontrado
 */
router.get("/:id", getFeedbackById);

/**
 * @swagger
 * /feedback/challenge/{challengeId}:
 *   get:
 *     summary: Busca feedbacks de um desafio
 *     tags: [ChallengeFeedback]
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de feedbacks do desafio
 */
router.get("/challenge/:challengeId", getFeedbacksByChallenge);

/**
 * @swagger
 * /feedback/challenge/{challengeId}/average:
 *   get:
 *     summary: Busca rating médio de um desafio
 *     tags: [ChallengeFeedback]
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rating médio e total de feedbacks
 */
router.get("/challenge/:challengeId/average", getChallengeAverageRating);

/**
 * @swagger
 * /feedback/challenge/{challengeId}/check:
 *   get:
 *     summary: Verifica se usuário já avaliou um desafio
 *     tags: [ChallengeFeedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Status da avaliação do usuário
 */
router.get("/challenge/:challengeId/check", verificarToken, checkUserFeedback);

/**
 * @swagger
 * /feedback/rating/{rating}:
 *   get:
 *     summary: Busca feedbacks por rating específico
 *     tags: [ChallengeFeedback]
 *     parameters:
 *       - in: path
 *         name: rating
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *     responses:
 *       200:
 *         description: Lista de feedbacks com o rating especificado
 */
router.get("/rating/:rating", getFeedbacksByRating);

/**
 * @swagger
 * /feedback/user/my-feedbacks:
 *   get:
 *     summary: Busca feedbacks do usuário logado
 *     tags: [ChallengeFeedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de feedbacks do usuário
 */
router.get("/user/my-feedbacks", verificarToken, getMyFeedbacks);

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Cria um novo feedback
 *     tags: [ChallengeFeedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *               - challengeId
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               challengeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Feedback criado com sucesso
 *       400:
 *         description: Dados inválidos ou usuário já avaliou
 */
router.post("/", verificarToken, createFeedback);

/**
 * @swagger
 * /feedback/{id}:
 *   put:
 *     summary: Atualiza um feedback (apenas do próprio usuário)
 *     tags: [ChallengeFeedback]
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
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Feedback atualizado com sucesso
 *       403:
 *         description: Sem permissão para editar este feedback
 *       404:
 *         description: Feedback não encontrado
 */
router.put("/:id", verificarToken, updateFeedback);

/**
 * @swagger
 * /feedback/{id}:
 *   delete:
 *     summary: Deleta um feedback (apenas do próprio usuário)
 *     tags: [ChallengeFeedback]
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
 *         description: Feedback deletado com sucesso
 *       403:
 *         description: Sem permissão para deletar este feedback
 *       404:
 *         description: Feedback não encontrado
 */
router.delete("/:id", verificarToken, deleteFeedback);

export default router;
