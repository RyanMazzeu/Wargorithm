import { RequestHandler } from "express";
import * as challengeRepository from "../repositories/challenge.repository";
import { Difficulty } from "@prisma/client";

// Listar todos os desafios
export const listAllChallenges: RequestHandler = async (_req, res) => {
  try {
    const challenges = await challengeRepository.listAll();
    res.status(200).json(challenges);
  } catch (error) {
    console.error("Erro ao listar desafios:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar desafio por ID
export const getChallengeById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID do desafio inválido." });
    return;
  }

  try {
    const challenge = await challengeRepository.findById(Number(id));
    if (!challenge) {
      res.status(404).json({ error: "Desafio não encontrado." });
      return;
    }
    res.status(200).json(challenge);
  } catch (error) {
    console.error("Erro ao buscar desafio:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar desafios por dificuldade
export const getChallengesByDifficulty: RequestHandler = async (req, res) => {
  const { difficulty } = req.params;

  if (!Object.values(Difficulty).includes(difficulty as Difficulty)) {
    res
      .status(400)
      .json({ error: "Dificuldade inválida. Use: EASY, MEDIUM ou HARD." });
    return;
  }

  try {
    const challenges = await challengeRepository.findByDifficulty(
      difficulty as Difficulty
    );
    res.status(200).json(challenges);
  } catch (error) {
    console.error("Erro ao buscar desafios por dificuldade:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Criar novo desafio
export const createChallenge: RequestHandler = async (req, res) => {
  const { title, description, input, expectedOutput, difficulty } = req.body;

  if (!title || !description || !input || !expectedOutput || !difficulty) {
    res.status(400).json({ error: "Todos os campos são obrigatórios." });
    return;
  }

  if (!Object.values(Difficulty).includes(difficulty)) {
    res
      .status(400)
      .json({ error: "Dificuldade inválida. Use: EASY, MEDIUM ou HARD." });
    return;
  }

  try {
    const challenge = await challengeRepository.create({
      title,
      description,
      input,
      expectedOutput,
      difficulty,
    });
    res.status(201).json(challenge);
  } catch (error) {
    console.error("Erro ao criar desafio:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Atualizar desafio
export const updateChallenge: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { title, description, input, expectedOutput, difficulty } = req.body;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID do desafio inválido." });
    return;
  }

  if (difficulty && !Object.values(Difficulty).includes(difficulty)) {
    res
      .status(400)
      .json({ error: "Dificuldade inválida. Use: EASY, MEDIUM ou HARD." });
    return;
  }

  try {
    const existingChallenge = await challengeRepository.findById(Number(id));
    if (!existingChallenge) {
      res.status(404).json({ error: "Desafio não encontrado." });
      return;
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (input) updateData.input = input;
    if (expectedOutput) updateData.expectedOutput = expectedOutput;
    if (difficulty) updateData.difficulty = difficulty;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: "Nenhum campo para atualizar." });
      return;
    }

    const updatedChallenge = await challengeRepository.update(
      Number(id),
      updateData
    );
    res.status(200).json(updatedChallenge);
  } catch (error) {
    console.error("Erro ao atualizar desafio:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Deletar desafio
export const deleteChallenge: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID do desafio inválido." });
    return;
  }

  try {
    const existingChallenge = await challengeRepository.findById(Number(id));
    if (!existingChallenge) {
      res.status(404).json({ error: "Desafio não encontrado." });
      return;
    }

    await challengeRepository.deleteChallenge(Number(id));
    res.status(200).json({ message: "Desafio deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar desafio:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Estatísticas de desafios por dificuldade
export const getChallengeStats: RequestHandler = async (_req, res) => {
  try {
    const stats = await challengeRepository.countByDifficulty();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas de desafios:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
