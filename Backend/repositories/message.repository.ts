import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Busca todas as mensagens de uma amizade, ordenadas por data.
 */
export const getMessages = async (friendshipId: number) => {
  return prisma.message.findMany({
    where: { friendshipId },
    include: {
      sender: {
        select: { id: true, name: true, photo: true },
      },
    },
    orderBy: { sentAt: "asc" },
  });
};

/**
 * Cria uma nova mensagem em uma amizade.
 */
export const createMessage = async (
  senderId: number,
  friendshipId: number,
  content: string
) => {
  return prisma.message.create({
    data: {
      senderId,
      friendshipId,
      content,
    },
  });
};
