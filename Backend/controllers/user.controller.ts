import { RequestHandler } from "express";
import * as userRepository from "../repositories/user.repository";
import argon2 from "argon2";

// Buscar usuário por e-mail (opcional, se estiver em uso em outras rotas)
export const findByEmail: RequestHandler = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return 
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};


// Listar todos os usuários
export const listAllUsers: RequestHandler = async (_req, res) => {
  try {
    const users = await userRepository.listAll();
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Atualizar nome e foto
export const updateProfile: RequestHandler = async (req, res) => {
  const userId = (req as any).usuarioId;
  const { name, photo } = req.body;

  if (!name && !photo) {
    res.status(400).json({ error: "Nada para atualizar." });
    return
  }

  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return 
    }

    const updatedUser = await userRepository.update(userId, { name, photo });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Atualizar apenas a senha
export const updatePassword: RequestHandler = async (req, res) => {
  const userId = (req as any).usuarioId;
  const { password } = req.body;

  if (!password || password.length < 6) {
    res.status(400).json({ error: "Senha inválida. Mínimo 6 caracteres." });
    return 
  }

  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return 
    }

    const hashedPassword = await argon2.hash(password);
    await userRepository.update(userId, { password: hashedPassword });

    res.status(200).json({ message: "Senha atualizada com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Deletar conta
export const deleteProfile: RequestHandler = async (req, res) => {
  const userId = (req as any).usuarioId;

  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return 
    }

    await userRepository.deleteUser(userId);
    res.status(200).json({ message: "Usuário deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar perfil:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
