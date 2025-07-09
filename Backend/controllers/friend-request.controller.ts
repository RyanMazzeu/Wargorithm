import { Request, Response, NextFunction } from "express";
import * as friendRepository from "../repositories/friend-request.repository"; // Ajuste o caminho
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Controller para enviar uma nova solicitação de amizade.
 * Espera `receiverId` no corpo da requisição.
 */
export const sendFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const senderId = (req as any).usuarioId;
    // Aceita tanto receiverId quanto recipientId
    const { receiverId, recipientId } = req.body;
    const finalReceiverId = receiverId ?? recipientId;

    if (!senderId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }
    if (!finalReceiverId || typeof finalReceiverId !== "number") {
      res.status(400).json({ message: "O ID do destinatário é obrigatório." });
      return;
    }

    const newRequest = await friendRepository.createRequest(
      senderId,
      finalReceiverId
    );
    res.status(201).json(newRequest);
  } catch (error) {
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
};

/**
 * Controller para listar as solicitações de amizade recebidas e pendentes.
 */
export const getIncomingRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).usuarioId;
    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    const requests = await friendRepository.getIncomingRequests(userId);
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller para aceitar uma solicitação de amizade.
 * Espera o `requestId` nos parâmetros da URL.
 */
export const acceptFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).usuarioId;
    const { requestId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    // Validação de segurança: Garante que o usuário logado é o destinatário da solicitação.
    // Embora o repositório possa ser chamado diretamente, o controller é a camada de segurança.
    const request = await prisma.friendRequest.findUnique({
      where: { id: parseInt(requestId) },
    });
    if (!request || request.receiverId !== userId) {
      res.status(403).json({
        message: "Você não tem permissão para aceitar esta solicitação.",
      });
      return;
    }

    await friendRepository.acceptRequest(parseInt(requestId));
    res.status(200).json({ message: "Amizade aceita com sucesso." });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller para rejeitar uma solicitação de amizade.
 * Espera o `requestId` nos parâmetros da URL.
 */
export const rejectFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).usuarioId;
    const { requestId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    // Validação de segurança semelhante à de aceitar
    const request = await prisma.friendRequest.findUnique({
      where: { id: parseInt(requestId) },
    });
    if (!request || request.receiverId !== userId) {
      res.status(403).json({
        message: "Você não tem permissão para rejeitar esta solicitação.",
      });
      return;
    }

    await friendRepository.rejectRequest(parseInt(requestId));
    res.status(200).json({ message: "Solicitação de amizade rejeitada." });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller para o remetente cancelar uma solicitação enviada.
 * Espera o `requestId` nos parâmetros da URL.
 */
export const cancelSentRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const senderId = (req as any).usuarioId;
    const { requestId } = req.params;

    if (!senderId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    await friendRepository.cancelRequest(parseInt(requestId), senderId);
    res.status(200).json({ message: "Solicitação cancelada com sucesso." });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller para listar todos os amigos do usuário logado.
 */
export const listFriends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).usuarioId;
    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    const friends = await friendRepository.getFriends(userId);
    res.status(200).json(friends);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller para remover uma amizade (unfriend).
 * Espera o `friendId` (ID do amigo a ser removido) nos parâmetros da URL.
 */
export const unfriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).usuarioId;
    const { friendId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    await friendRepository.removeFriend(userId, parseInt(friendId));
    res.status(200).json({ message: "Amizade removida com sucesso." });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller para checar o status de relacionamento com outro usuário.
 * Espera o `otherUserId` nos parâmetros da URL.
 */
export const checkRelationship = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId1 = (req as any).usuarioId;
    const { otherUserId } = req.params;

    if (!userId1) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    const status = await friendRepository.getRelationshipStatus(
      userId1,
      parseInt(otherUserId)
    );
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller para listar as solicitações de amizade enviadas.
 */
export const getSentRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).usuarioId;
    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    const requests = await friendRepository.getSentRequests(userId);
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};
