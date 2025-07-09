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

  const hashed = await argon2.hash(password);
  const user = await userRepository.create({
    name,
    email,
    password: hashed,
  });

  const { password: _, ...userWithoutPassword } = user;
  res.status(201).json(userWithoutPassword);
};

export const loginUser: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await userRepository.findByEmail(email);
  if (!user || !(await argon2.verify(user.password, password))) {
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
      photo: user.photo || null,
    },
  });
};
