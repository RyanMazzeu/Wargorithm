import { RequestHandler } from "express";
import * as matchHistoryRepository from "../repositories/match-history.repository";

// Listar todo o histórico (admin)
export const listAllHistory: RequestHandler = async (_req, res) => {
  try {
    const history = await matchHistoryRepository.listAll();
    res.status(200).json(history);
  } catch (error) {
    console.error("Erro ao listar histórico:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar histórico por ID
export const getHistoryById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID do histórico inválido." });
    return;
  }

  try {
    const history = await matchHistoryRepository.findById(Number(id));
    if (!history) {
      res.status(404).json({ error: "Histórico não encontrado." });
      return;
    }
    res.status(200).json(history);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar histórico do usuário logado
export const getMyHistory: RequestHandler = async (req, res) => {
  const userId = (req as any).usuarioId;

  try {
    const history = await matchHistoryRepository.findByUserId(userId);
    res.status(200).json(history);
  } catch (error) {
    console.error("Erro ao buscar histórico do usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar histórico por partida
export const getHistoryByMatch: RequestHandler = async (req, res) => {
  const { matchId } = req.params;

  if (!matchId || isNaN(Number(matchId))) {
    res.status(400).json({ error: "ID da partida inválido." });
    return;
  }

  try {
    const history = await matchHistoryRepository.findByMatchId(Number(matchId));
    res.status(200).json(history);
  } catch (error) {
    console.error("Erro ao buscar histórico da partida:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar vitórias do usuário logado
export const getMyVictories: RequestHandler = async (req, res) => {
  const userId = (req as any).usuarioId;

  try {
    const victories = await matchHistoryRepository.findVictoriesByUserId(
      userId
    );
    res.status(200).json(victories);
  } catch (error) {
    console.error("Erro ao buscar vitórias do usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Criar novo registro de histórico
export const createHistory: RequestHandler = async (req, res) => {
  const { scoreGained, wasVictory, userId, matchId } = req.body;

  if (
    typeof scoreGained !== "number" ||
    typeof wasVictory !== "boolean" ||
    !userId ||
    !matchId
  ) {
    res.status(400).json({
      error:
        "scoreGained (number), wasVictory (boolean), userId e matchId são obrigatórios.",
    });
    return;
  }

  try {
    const history = await matchHistoryRepository.create({
      scoreGained: Number(scoreGained),
      wasVictory,
      userId: Number(userId),
      matchId: Number(matchId),
    });
    res.status(201).json(history);
  } catch (error) {
    console.error("Erro ao criar histórico:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Atualizar histórico
export const updateHistory: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { scoreGained, wasVictory } = req.body;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID do histórico inválido." });
    return;
  }

  try {
    const existingHistory = await matchHistoryRepository.findById(Number(id));
    if (!existingHistory) {
      res.status(404).json({ error: "Histórico não encontrado." });
      return;
    }

    const updateData: any = {};
    if (typeof scoreGained === "number")
      updateData.scoreGained = Number(scoreGained);
    if (typeof wasVictory === "boolean") updateData.wasVictory = wasVictory;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: "Nenhum campo para atualizar." });
      return;
    }

    const updatedHistory = await matchHistoryRepository.update(
      Number(id),
      updateData
    );
    res.status(200).json(updatedHistory);
  } catch (error) {
    console.error("Erro ao atualizar histórico:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Deletar histórico
export const deleteHistory: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID do histórico inválido." });
    return;
  }

  try {
    const existingHistory = await matchHistoryRepository.findById(Number(id));
    if (!existingHistory) {
      res.status(404).json({ error: "Histórico não encontrado." });
      return;
    }

    await matchHistoryRepository.deleteHistory(Number(id));
    res.status(200).json({ message: "Histórico deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar histórico:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Estatísticas de pontuação do usuário
export const getMyStats: RequestHandler = async (req, res) => {
  const userId = (req as any).usuarioId;

  try {
    const stats = await matchHistoryRepository.getScoreStatsByUserId(userId);
    const victoryCount = await matchHistoryRepository.countVictoriesByUserId(
      userId
    );

    res.status(200).json({
      totalScore: stats._sum.scoreGained || 0,
      averageScore: stats._avg.scoreGained || 0,
      totalMatches: stats._count.wasVictory || 0,
      victories: victoryCount,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas do usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Top ranking global
export const getTopRanking: RequestHandler = async (req, res) => {
  const { limit } = req.query;
  const rankingLimit = limit ? Math.min(Number(limit), 100) : 10; // máximo 100

  try {
    const ranking = await matchHistoryRepository.getTopRanking(rankingLimit);
    res.status(200).json(ranking);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Contar vitórias do usuário
export const getMyVictoryCount: RequestHandler = async (req, res) => {
  const userId = (req as any).usuarioId;

  try {
    const count = await matchHistoryRepository.countVictoriesByUserId(userId);
    res.status(200).json({ victories: count });
  } catch (error) {
    console.error("Erro ao contar vitórias:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
