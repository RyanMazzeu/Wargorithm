import { RequestHandler } from "express";
import * as userRepository from "../repositories/user.repository";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const registerUser: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || password.length < 6) {
    res.status(400).json({ error: "Dados inválidos." });
    return;
  }

  const userExists = await userRepository.findByEmail(email);
  if (userExists) {
    res.status(400).json({ error: "Email já cadastrado." });
    return;
  }

  const hashed = await argon2.hash(password); // Argon2 hash
  const user = await userRepository.create({
    name,
    email,
    password: hashed,
  });

  res.status(201).json(user);
};

export const loginUser: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await userRepository.findByEmail(email);
  if (!user || !(await argon2.verify(user.password, password))) {
    // Argon2 verify
    res.status(401).json({ error: "Credenciais inválidas." });
    return;
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.json({
    message: "Login bem-sucedido.",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      ranking: user.ranking,
      victories: user.victories,
    },
  });
};

export const getProfile: RequestHandler = async (req, res) => {
  const userId = (req as any).usuarioId;

  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
