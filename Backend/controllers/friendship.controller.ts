import { Request, Response } from "express";
import * as friendshipRepo from "../repositories/friendship.repository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /friends
export const listFriends = async (req: Request, res: Response) => {
  const userId = (req as any).usuarioId;
  if (!userId) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }
  try {
    const friendships = await friendshipRepo.findFriendsByUserId(userId);
    const friends = friendships.map((friendship: any) => {
      return friendship.userAId === userId
        ? friendship.userB
        : friendship.userA;
    });
    return res.status(200).json(friends);
  } catch (error) {
    return res.status(500).json({ message: "Erro interno ao listar amigos." });
  }
};

// DELETE /friends/:friendId
export const removeFriend = async (req: Request, res: Response) => {
  const userId = (req as any).usuarioId;
  if (!userId) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }
  const { friendId } = req.params;
  try {
    // Procura a amizade entre userId e friendId
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userAId: userId, userBId: Number(friendId) },
          { userAId: Number(friendId), userBId: userId },
        ],
      },
    });
    if (!friendship) {
      return res.status(404).json({ message: "Amizade não encontrada." });
    }
    await friendshipRepo.deleteFriendshipById(friendship.id);
    return res.status(200).json({ message: "Amizade removida com sucesso." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno ao remover amizade." });
  }
};

// GET /friends/status/:otherUserId
export const checkRelationship = async (req: Request, res: Response) => {
  const userId = (req as any).usuarioId;
  if (!userId) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }
  const { otherUserId } = req.params;
  try {
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userAId: userId, userBId: Number(otherUserId) },
          { userAId: Number(otherUserId), userBId: userId },
        ],
      },
    });
    if (friendship) {
      return res.status(200).json({ status: "friends" });
    }
    // Aqui você pode adicionar lógica para checar se há solicitação pendente, etc.
    return res.status(200).json({ status: "not_friends" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao checar status de amizade." });
  }
};
