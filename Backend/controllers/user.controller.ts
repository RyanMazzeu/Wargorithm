import { Request, Response } from "express";
import * as userRepository from "../repositories/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ error: "Dados inválidos." });
  }

  const userExists = await userRepository.findByEmail(email);
  if (userExists)
    return res.status(400).json({ error: "Email já cadastrado." });

  const hashed = await bcrypt.hash(password, 10);
  const user = await userRepository.create({
    name,
    email,
    password: hashed,
    photo: null,
  });

  res.status(201).json(user);
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userRepository.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Credenciais inválidas." });
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

export const getProfile = async (req: Request, res: Response) => {
  const userId = (req as any).usuarioId;

  try {
    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
