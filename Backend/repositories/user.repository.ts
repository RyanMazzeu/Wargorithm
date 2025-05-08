import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const findByEmail = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findById = (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: { name: true, email: true, ranking: true, victories: true },
  });
};

export const create = (
  data: Omit<User, "id" | "createdAt" | "ranking" | "victories">
) => {
  return prisma.user.create({ data });
};
