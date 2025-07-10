import { RequestHandler } from "express";
import * as matchRepository from "../repositories/match.repository";
import { MatchStatus } from "@prisma/client";

// Listar todas as partidas
export const listAllMatches: RequestHandler = async (_req, res) => {
  try {
    const matches = await matchRepository.listAll();
    res.status(200).json(matches);
  } catch (error) {
    console.error("Erro ao listar partidas:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar partida por ID
export const getMatchById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID da partida inválido." });
    return;
  }

  try {
    const match = await matchRepository.findById(Number(id));
    if (!match) {
      res.status(404).json({ error: "Partida não encontrada." });
      return;
    }
    res.status(200).json(match);
  } catch (error) {
    console.error("Erro ao buscar partida:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar partidas de um usuário
export const getMatchesByUser: RequestHandler = async (req, res) => {
  const userId = (req as any).usuarioId;

  try {
    const matches = await matchRepository.findByUserId(userId);
    res.status(200).json(matches);
  } catch (error) {
    console.error("Erro ao buscar partidas do usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar partidas em andamento
export const getMatchesInProgress: RequestHandler = async (_req, res) => {
  try {
    const matches = await matchRepository.findInProgress();
    res.status(200).json(matches);
  } catch (error) {
    console.error("Erro ao buscar partidas em andamento:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Criar nova partida
export const createMatch: RequestHandler = async (req, res) => {
  const { playerBId, challengeId, durationSeconds } = req.body;
  const playerAId = (req as any).usuarioId;

  if (!playerBId || !challengeId) {
    res
      .status(400)
      .json({ error: "playerBId e challengeId são obrigatórios." });
    return;
  }

  if (playerAId === playerBId) {
    res.status(400).json({ error: "Não é possível jogar contra você mesmo." });
    return;
  }

  try {
    const match = await matchRepository.create({
      startedAt: new Date(),
      durationSeconds: durationSeconds || 1800, // 30 minutos por padrão
      playerAId,
      playerBId: Number(playerBId),
      challengeId: Number(challengeId),
    });
    res.status(201).json(match);
  } catch (error) {
    console.error("Erro ao criar partida:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Finalizar partida
export const finishMatch: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { winnerId, durationSeconds } = req.body;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID da partida inválido." });
    return;
  }

  try {
    const existingMatch = await matchRepository.findById(Number(id));
    if (!existingMatch) {
      res.status(404).json({ error: "Partida não encontrada." });
      return;
    }

    if (existingMatch.status !== MatchStatus.IN_PROGRESS) {
      res.status(400).json({ error: "A partida já foi finalizada." });
      return;
    }

    const updateData: any = {
      status: MatchStatus.FINISHED,
    };

    if (winnerId) {
      updateData.winnerId = Number(winnerId);
    }

    if (durationSeconds) {
      updateData.durationSeconds = Number(durationSeconds);
    }

    const updatedMatch = await matchRepository.update(Number(id), updateData);
    res.status(200).json(updatedMatch);
  } catch (error) {
    console.error("Erro ao finalizar partida:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Cancelar partida
export const cancelMatch: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID da partida inválido." });
    return;
  }

  try {
    const existingMatch = await matchRepository.findById(Number(id));
    if (!existingMatch) {
      res.status(404).json({ error: "Partida não encontrada." });
      return;
    }

    if (existingMatch.status !== MatchStatus.IN_PROGRESS) {
      res
        .status(400)
        .json({ error: "Só é possível cancelar partidas em andamento." });
      return;
    }

    const updatedMatch = await matchRepository.update(Number(id), {
      status: MatchStatus.CANCELED,
    });
    res.status(200).json(updatedMatch);
  } catch (error) {
    console.error("Erro ao cancelar partida:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Deletar partida
export const deleteMatch: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID da partida inválido." });
    return;
  }

  try {
    const existingMatch = await matchRepository.findById(Number(id));
    if (!existingMatch) {
      res.status(404).json({ error: "Partida não encontrada." });
      return;
    }

    await matchRepository.deleteMatch(Number(id));
    res.status(200).json({ message: "Partida deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar partida:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Estatísticas de partidas
export const getMatchStats: RequestHandler = async (_req, res) => {
  try {
    const stats = await matchRepository.getMatchStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas de partidas:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
