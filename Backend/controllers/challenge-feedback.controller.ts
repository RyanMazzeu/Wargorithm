import { RequestHandler } from "express";
import * as challengeFeedbackRepository from "../repositories/challenge-feedback.repository";

// Listar todos os feedbacks
export const listAllFeedbacks: RequestHandler = async (_req, res) => {
  try {
    const feedbacks = await challengeFeedbackRepository.listAll();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Erro ao listar feedbacks:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar feedback por ID
export const getFeedbackById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID do feedback inválido." });
    return;
  }

  try {
    const feedback = await challengeFeedbackRepository.findById(Number(id));
    if (!feedback) {
      res.status(404).json({ error: "Feedback não encontrado." });
      return;
    }
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Erro ao buscar feedback:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar feedbacks por desafio
export const getFeedbacksByChallenge: RequestHandler = async (req, res) => {
  const { challengeId } = req.params;

  if (!challengeId || isNaN(Number(challengeId))) {
    res.status(400).json({ error: "ID do desafio inválido." });
    return;
  }

  try {
    const feedbacks = await challengeFeedbackRepository.findByChallengeId(
      Number(challengeId)
    );
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Erro ao buscar feedbacks do desafio:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar feedbacks do usuário logado
export const getMyFeedbacks: RequestHandler = async (req, res) => {
  const userId = (req as any).usuarioId;

  try {
    const feedbacks = await challengeFeedbackRepository.findByUserId(userId);
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Erro ao buscar feedbacks do usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Verificar se usuário já avaliou um desafio
export const checkUserFeedback: RequestHandler = async (req, res) => {
  const { challengeId } = req.params;
  const userId = (req as any).usuarioId;

  if (!challengeId || isNaN(Number(challengeId))) {
    res.status(400).json({ error: "ID do desafio inválido." });
    return;
  }

  try {
    const feedback = await challengeFeedbackRepository.findByUserAndChallenge(
      userId,
      Number(challengeId)
    );

    res.status(200).json({
      hasEvaluated: !!feedback,
      feedback: feedback || null,
    });
  } catch (error) {
    console.error("Erro ao verificar avaliação:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Criar novo feedback
export const createFeedback: RequestHandler = async (req, res) => {
  const { rating, comment, challengeId } = req.body;
  const userId = (req as any).usuarioId;

  if (!rating || !comment || !challengeId) {
    res
      .status(400)
      .json({ error: "rating, comment e challengeId são obrigatórios." });
    return;
  }

  if (rating < 1 || rating > 5) {
    res.status(400).json({ error: "Rating deve ser entre 1 e 5." });
    return;
  }

  try {
    // Verificar se o usuário já avaliou este desafio
    const existingFeedback =
      await challengeFeedbackRepository.findByUserAndChallenge(
        userId,
        Number(challengeId)
      );

    if (existingFeedback) {
      res.status(400).json({ error: "Você já avaliou este desafio." });
      return;
    }

    const feedback = await challengeFeedbackRepository.create({
      rating: Number(rating),
      comment,
      userId,
      challengeId: Number(challengeId),
    });
    res.status(201).json(feedback);
  } catch (error) {
    console.error("Erro ao criar feedback:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Atualizar feedback (apenas do próprio usuário)
export const updateFeedback: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = (req as any).usuarioId;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID do feedback inválido." });
    return;
  }

  if (rating && (rating < 1 || rating > 5)) {
    res.status(400).json({ error: "Rating deve ser entre 1 e 5." });
    return;
  }

  try {
    const existingFeedback = await challengeFeedbackRepository.findById(
      Number(id)
    );
    if (!existingFeedback) {
      res.status(404).json({ error: "Feedback não encontrado." });
      return;
    }

    // Verificar se o feedback pertence ao usuário logado
    if (existingFeedback.user.id !== userId) {
      res
        .status(403)
        .json({ error: "Você só pode editar seus próprios feedbacks." });
      return;
    }

    const updateData: any = {};
    if (rating) updateData.rating = Number(rating);
    if (comment) updateData.comment = comment;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: "Nenhum campo para atualizar." });
      return;
    }

    const updatedFeedback = await challengeFeedbackRepository.update(
      Number(id),
      updateData
    );
    res.status(200).json(updatedFeedback);
  } catch (error) {
    console.error("Erro ao atualizar feedback:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Deletar feedback (apenas do próprio usuário)
export const deleteFeedback: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const userId = (req as any).usuarioId;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID do feedback inválido." });
    return;
  }

  try {
    const existingFeedback = await challengeFeedbackRepository.findById(
      Number(id)
    );
    if (!existingFeedback) {
      res.status(404).json({ error: "Feedback não encontrado." });
      return;
    }

    // Verificar se o feedback pertence ao usuário logado
    if (existingFeedback.user.id !== userId) {
      res
        .status(403)
        .json({ error: "Você só pode deletar seus próprios feedbacks." });
      return;
    }

    await challengeFeedbackRepository.deleteFeedback(Number(id));
    res.status(200).json({ message: "Feedback deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar feedback:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Obter rating médio de um desafio
export const getChallengeAverageRating: RequestHandler = async (req, res) => {
  const { challengeId } = req.params;

  if (!challengeId || isNaN(Number(challengeId))) {
    res.status(400).json({ error: "ID do desafio inválido." });
    return;
  }

  try {
    const stats = await challengeFeedbackRepository.getAverageRatingByChallenge(
      Number(challengeId)
    );

    res.status(200).json({
      averageRating: stats._avg.rating || 0,
      totalFeedbacks: stats._count.rating || 0,
    });
  } catch (error) {
    console.error("Erro ao calcular rating médio:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar feedbacks por rating
export const getFeedbacksByRating: RequestHandler = async (req, res) => {
  const { rating } = req.params;

  if (
    !rating ||
    isNaN(Number(rating)) ||
    Number(rating) < 1 ||
    Number(rating) > 5
  ) {
    res.status(400).json({ error: "Rating deve ser um número entre 1 e 5." });
    return;
  }

  try {
    const feedbacks = await challengeFeedbackRepository.findByRating(
      Number(rating)
    );
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Erro ao buscar feedbacks por rating:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
