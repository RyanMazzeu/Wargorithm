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

/**
 * Atualiza o conteúdo de uma mensagem.
 */
export const updateMessage = async (messageId: number, content: string) => {
  return prisma.message.update({
    where: { id: messageId },
    data: { content },
  });
};

/**
 * Remove uma mensagem.
 */
export const deleteMessage = async (messageId: number) => {
  return prisma.message.delete({
    where: { id: messageId },
  });
};
