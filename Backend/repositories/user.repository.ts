import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

type UserInput = Prisma.UserCreateInput;

export const findByEmail = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findById = (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      name: true,
      email: true,
      ranking: true,
      victories: true,
    },
  });
};

export const create = (
  data: Omit<UserInput, "id" | "createdAt" | "ranking" | "victories">
) => {
  return prisma.user.create({ data });
};

export const update = (id: number, data: Partial<UserInput>) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = (id: number) => {
  return prisma.user.delete({ where: { id } });
};
