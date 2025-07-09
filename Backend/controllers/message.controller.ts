import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import * as messageRepo from "../repositories/message.repository";

const prisma = new PrismaClient();

/**
 * GET /friends/:friendshipId/messages
 */
export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).usuarioId;
    const friendshipId = parseInt(req.params.friendshipId);

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });
    if (
      !friendship ||
      (friendship.userAId !== userId && friendship.userBId !== userId)
    ) {
      res.status(403).json({ message: "Acesso não autorizado." });
      return;
    }

    const messages = await messageRepo.getMessages(friendshipId);
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /friends/:friendshipId/messages
 * body: { content: string }
 */
export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const senderId = (req as any).usuarioId;
    const friendshipId = parseInt(req.params.friendshipId);
    const { content } = req.body;

    if (!senderId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }
    if (!content || typeof content !== "string") {
      res.status(400).json({ message: "Conteúdo obrigatório." });
      return;
    }

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });
    if (
      !friendship ||
      (friendship.userAId !== senderId && friendship.userBId !== senderId)
    ) {
      res.status(403).json({ message: "Acesso não autorizado." });
      return;
    }

    const message = await messageRepo.createMessage(
      senderId,
      friendshipId,
      content
    );
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /friends/:friendshipId/messages/:messageId
 */
export const updateMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).usuarioId;
    const friendshipId = parseInt(req.params.friendshipId);
    const messageId = parseInt(req.params.messageId);
    const { content } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }
    if (!content || typeof content !== "string") {
      res.status(400).json({ message: "Conteúdo obrigatório." });
      return;
    }

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });
    if (
      !friendship ||
      (friendship.userAId !== userId && friendship.userBId !== userId)
    ) {
      res.status(403).json({ message: "Acesso não autorizado." });
      return;
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });
    if (!message || message.friendshipId !== friendshipId) {
      res.status(404).json({ message: "Mensagem não encontrada." });
      return;
    }
    if (message.senderId !== userId) {
      res
        .status(403)
        .json({ message: "Não autorizado para editar esta mensagem." });
      return;
    }

    const updated = await messageRepo.updateMessage(messageId, content);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /friends/:friendshipId/messages/:messageId
 */
export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).usuarioId;
    const friendshipId = parseInt(req.params.friendshipId);
    const messageId = parseInt(req.params.messageId);

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });
    if (
      !friendship ||
      (friendship.userAId !== userId && friendship.userBId !== userId)
    ) {
      res.status(403).json({ message: "Acesso não autorizado." });
      return;
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });
    if (!message || message.friendshipId !== friendshipId) {
      res.status(404).json({ message: "Mensagem não encontrada." });
      return;
    }
    if (message.senderId !== userId) {
      res
        .status(403)
        .json({ message: "Não autorizado para apagar esta mensagem." });
      return;
    }

    await messageRepo.deleteMessage(messageId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
