import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const verificarToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Token não fornecido." });
    return;
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };

    (req as any).usuarioId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado." });
  }
};
