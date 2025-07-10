import { RequestHandler } from "express";
import * as submissionRepository from "../repositories/submission.repository";
import { Language } from "@prisma/client";

// Listar todas as submissões
export const listAllSubmissions: RequestHandler = async (_req, res) => {
  try {
    const submissions = await submissionRepository.listAll();
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Erro ao listar submissões:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar submissão por ID
export const getSubmissionById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID da submissão inválido." });
    return;
  }

  try {
    const submission = await submissionRepository.findById(Number(id));
    if (!submission) {
      res.status(404).json({ error: "Submissão não encontrada." });
      return;
    }
    res.status(200).json(submission);
  } catch (error) {
    console.error("Erro ao buscar submissão:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar submissões do usuário logado
export const getMySubmissions: RequestHandler = async (req, res) => {
  const userId = (req as any).usuarioId;

  try {
    const submissions = await submissionRepository.findByUserId(userId);
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Erro ao buscar submissões do usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar submissões por partida
export const getSubmissionsByMatch: RequestHandler = async (req, res) => {
  const { matchId } = req.params;

  if (!matchId || isNaN(Number(matchId))) {
    res.status(400).json({ error: "ID da partida inválido." });
    return;
  }

  try {
    const submissions = await submissionRepository.findByMatchId(
      Number(matchId)
    );
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Erro ao buscar submissões da partida:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar submissões corretas do usuário
export const getMyCorrectSubmissions: RequestHandler = async (req, res) => {
  const userId = (req as any).usuarioId;

  try {
    const submissions = await submissionRepository.findCorrectByUserId(userId);
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Erro ao buscar submissões corretas do usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Criar nova submissão
export const createSubmission: RequestHandler = async (req, res) => {
  const { code, language, isCorrect, matchId } = req.body;
  const userId = (req as any).usuarioId;

  if (!code || !language || !matchId || typeof isCorrect !== "boolean") {
    res
      .status(400)
      .json({
        error:
          "Todos os campos são obrigatórios (code, language, isCorrect, matchId).",
      });
    return;
  }

  if (!Object.values(Language).includes(language)) {
    res.status(400).json({
      error:
        "Linguagem inválida. Use: JAVASCRIPT, PYTHON, JAVA, C, CPP, GO ou RUST.",
    });
    return;
  }

  try {
    const submission = await submissionRepository.create({
      code,
      language,
      isCorrect,
      userId,
      matchId: Number(matchId),
    });
    res.status(201).json(submission);
  } catch (error) {
    console.error("Erro ao criar submissão:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Atualizar submissão
export const updateSubmission: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { code, language, isCorrect } = req.body;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID da submissão inválido." });
    return;
  }

  if (language && !Object.values(Language).includes(language)) {
    res.status(400).json({
      error:
        "Linguagem inválida. Use: JAVASCRIPT, PYTHON, JAVA, C, CPP, GO ou RUST.",
    });
    return;
  }

  try {
    const existingSubmission = await submissionRepository.findById(Number(id));
    if (!existingSubmission) {
      res.status(404).json({ error: "Submissão não encontrada." });
      return;
    }

    const updateData: any = {};
    if (code) updateData.code = code;
    if (language) updateData.language = language;
    if (typeof isCorrect === "boolean") updateData.isCorrect = isCorrect;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: "Nenhum campo para atualizar." });
      return;
    }

    const updatedSubmission = await submissionRepository.update(
      Number(id),
      updateData
    );
    res.status(200).json(updatedSubmission);
  } catch (error) {
    console.error("Erro ao atualizar submissão:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Deletar submissão
export const deleteSubmission: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID da submissão inválido." });
    return;
  }

  try {
    const existingSubmission = await submissionRepository.findById(Number(id));
    if (!existingSubmission) {
      res.status(404).json({ error: "Submissão não encontrada." });
      return;
    }

    await submissionRepository.deleteSubmission(Number(id));
    res.status(200).json({ message: "Submissão deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar submissão:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Estatísticas de submissões por linguagem
export const getSubmissionStats: RequestHandler = async (_req, res) => {
  try {
    const stats = await submissionRepository.getSubmissionStatsByLanguage();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas de submissões:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Última submissão do usuário em uma partida
export const getLastSubmissionInMatch: RequestHandler = async (req, res) => {
  const { matchId } = req.params;
  const userId = (req as any).usuarioId;

  if (!matchId || isNaN(Number(matchId))) {
    res.status(400).json({ error: "ID da partida inválido." });
    return;
  }

  try {
    const submission =
      await submissionRepository.getLastSubmissionByUserAndMatch(
        userId,
        Number(matchId)
      );

    if (!submission) {
      res
        .status(404)
        .json({ error: "Nenhuma submissão encontrada para esta partida." });
      return;
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error("Erro ao buscar última submissão:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
