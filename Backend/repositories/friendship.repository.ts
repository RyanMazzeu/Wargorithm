import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Cria uma nova amizade entre dois usuários
export const createFriendship = (userAId: number, userBId: number) => {
  return prisma.friendship.create({
    data: { userAId, userBId },
  });
};

// Busca todas as amizades de um usuário
export const findFriendsByUserId = (userId: number) => {
  return prisma.friendship.findMany({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    include: {
      userA: { select: { id: true, name: true, photo: true } },
      userB: { select: { id: true, name: true, photo: true } },
    },
  });
};

// Deleta uma amizade pelo ID
export const deleteFriendshipById = (friendshipId: number) => {
  return prisma.friendship.delete({ where: { id: friendshipId } });
};
