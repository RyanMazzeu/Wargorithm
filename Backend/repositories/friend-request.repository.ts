import { PrismaClient, FriendRequestStatus, User } from "@prisma/client";

const prisma = new PrismaClient();

// --- GERENCIAMENTO DE SOLICITAÇÕES DE AMIZADE ---

/**
 * Cria uma solicitação de amizade, validando as regras de negócio.
 */
export const createRequest = async (senderId: number, receiverId: number) => {
  if (senderId === receiverId) {
    throw new Error(
      "Um usuário não pode enviar uma solicitação para si mesmo."
    );
  }

  // Verifica se já são amigos
  const areFriends = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userAId: senderId, userBId: receiverId },
        { userAId: receiverId, userBId: senderId },
      ],
    },
  });

  if (areFriends) {
    throw new Error("Estes usuários já são amigos.");
  }

  // Verifica se já existe uma solicitação pendente
  const existingRequest = await prisma.friendRequest.findFirst({
    where: {
      status: "PENDING",
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
  });

  if (existingRequest) {
    throw new Error("Já existe uma solicitação de amizade pendente.");
  }

  return prisma.friendRequest.create({
    data: {
      senderId,
      receiverId,
      status: FriendRequestStatus.PENDING,
    },
  });
};

/**
 * Aceita uma solicitação de amizade.
 * Usa uma transação para marcar a solicitação como aceita e criar o registro de amizade.
 */
export const acceptRequest = async (requestId: number) => {
  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId, status: "PENDING" },
  });

  if (!request) {
    throw new Error("Solicitação não encontrada ou já respondida.");
  }

  const { senderId, receiverId } = request;

  // Garante uma ordem consistente para salvar na tabela Friendship
  const userAId = Math.min(senderId, receiverId);
  const userBId = Math.max(senderId, receiverId);

  return prisma.$transaction(async (tx) => {
    // 1. Marca a solicitação como aceita
    await tx.friendRequest.update({
      where: { id: requestId },
      data: { status: FriendRequestStatus.ACCEPTED },
    });

    // 2. Cria o registro único de amizade
    return tx.friendship.create({
      data: {
        userAId,
        userBId,
      },
    });
  });
};

/**
 * Recusa uma solicitação de amizade.
 */
export const rejectRequest = (requestId: number) => {
  return prisma.friendRequest.update({
    where: { id: requestId, status: "PENDING" },
    data: { status: FriendRequestStatus.REJECTED },
  });
};

/**
 * Cancela uma solicitação enviada pelo próprio usuário.
 */
export const cancelRequest = (requestId: number, senderId: number) => {
  return prisma.friendRequest.delete({
    where: { id: requestId, senderId: senderId }, // Garante que só o remetente pode cancelar
  });
};

/**
 * Busca as solicitações PENDENTES recebidas por um usuário.
 */
export const getIncomingRequests = (userId: number) => {
  return prisma.friendRequest.findMany({
    where: { receiverId: userId, status: FriendRequestStatus.PENDING },
    include: {
      sender: {
        select: { id: true, name: true, photo: true, ranking: true },
      },
    },
  });
};

/**
 * Busca as solicitações PENDENTES enviadas por um usuário.
 */
export const getSentRequests = (userId: number) => {
  return prisma.friendRequest.findMany({
    where: { senderId: userId, status: "PENDING" },
    include: {
      receiver: {
        select: { id: true, name: true, photo: true, ranking: true },
      },
    },
  });
};

// --- GERENCIAMENTO DE AMIZADES ---

/**
 * Lista todos os amigos de um usuário.
 * Busca em ambas as colunas (userAId e userBId) e retorna o outro usuário.
 */
export const getFriends = async (userId: number): Promise<Partial<User>[]> => {
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    include: {
      userA: { select: { id: true, name: true, photo: true, ranking: true } },
      userB: { select: { id: true, name: true, photo: true, ranking: true } },
    },
  });

  // Mapear para incluir friendship.id e dados do amigo
  const friendsWithId = friendships.map((friendship) => {
    const friend = friendship.userAId === userId ? friendship.userB : friendship.userA;
    return {
      friendshipId: friendship.id,
      id: friend.id,
      name: friend.name,
      photo: friend.photo,
      ranking: friend.ranking,
    };
  });
  return friendsWithId;
};

/**
 * Remove uma amizade (unfriend).
 */
export const removeFriend = async (userId: number, friendId: number) => {
  // Encontra o ID da amizade para deletar
  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userAId: userId, userBId: friendId },
        { userAId: friendId, userBId: userId },
      ],
    },
  });

  if (!friendship) {
    throw new Error("Amizade não encontrada.");
  }

  // Também é uma boa ideia deletar as mensagens trocadas, se a regra de negócio exigir
  // await prisma.message.deleteMany({ where: { friendshipId: friendship.id }});

  return prisma.friendship.delete({
    where: { id: friendship.id },
  });
};

/**
 * Verifica o status de amizade/solicitação entre dois usuários.
 */
export const getRelationshipStatus = async (
  userId1: number,
  userId2: number
) => {
  // 1. Verifica se são amigos
  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userAId: userId1, userBId: userId2 },
        { userAId: userId2, userBId: userId1 },
      ],
    },
  });
  if (friendship) return { status: "FRIENDS" };

  // 2. Verifica se há uma solicitação pendente
  const request = await prisma.friendRequest.findFirst({
    where: {
      status: "PENDING",
      OR: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    },
  });
  if (request) {
    return {
      status: "PENDING",
      // Informa quem enviou a solicitação
      sentBy: request.senderId === userId1 ? "me" : "them",
    };
  }

  // 3. Nenhuma relação
  return { status: "NONE" };
};
