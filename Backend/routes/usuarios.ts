import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();

interface UsuarioRequestBody {
  name: string;
  email: string;
  password: string;
}

const verificarToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Token não fornecido." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).usuarioId = (decoded as any).id;
    next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido ou expirado." });
  }
};

const validarUsuario = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body as UsuarioRequestBody;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Todos os campos são obrigatórios." });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "Senha deve ter no mínimo 6 caracteres." });
    return;
  }

  next();
  return;
};

router.post(
  "/usuarios",
  validarUsuario,
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body as UsuarioRequestBody;

    try {
      const usuarioExistente = await prisma.user.findUnique({
        where: { email },
      });

      if (usuarioExistente) {
        res.status(400).json({ error: "Email já cadastrado." });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const novoUsuario = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      res.status(201).json({
        id: novoUsuario.id,
        name: novoUsuario.name,
        email: novoUsuario.email,
        ranking: novoUsuario.ranking,
        victories: novoUsuario.victories,
        createdAt: novoUsuario.createdAt,
      });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
);

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email e senha são obrigatórios." });
    return;
  }

  try {
    const usuario = await prisma.user.findUnique({
      where: { email },
    });

    if (!usuario) {
      console.log("Usuário não encontrado");
      res.status(401).json({ error: "Credenciais inválidas." });
      return;
    }

    const senhaCorreta = await bcrypt.compare(password, usuario.password);

    if (!senhaCorreta) {
      res.status(401).json({ error: "Credenciais inválidas." });
      return;
    }
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login bem-sucedido.",
      token,
      user: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        ranking: usuario.ranking,
        victories: usuario.victories,
      },
    });
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

router.get("/perfil", verificarToken, async (req: Request, res: Response): Promise<void> => {
  const usuarioId = (req as any).usuarioId;

  try {
    const usuario = await prisma.user.findUnique({
      where: { id: usuarioId },
      select: {
        name: true,
        email: true,
        ranking: true,
        victories: true,
      },
    });

    if (!usuario) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});
export default router;
