import { PrismaClient, Prisma } from "@prisma/client";
import dotenv from "dotenv";
const prisma = new PrismaClient();

dotenv.config();

type UserInput = Prisma.UserCreateInput;

// Listar todos os usuários (visão pública)
export const listAll = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      ranking: true,
      victories: true,
      photo: true,
    },
  });
};

// Buscar usuário por ID (dados completos)
export const findById = (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      ranking: true,
      victories: true,
      photo: true,
    },
  });
};

// Buscar usuário por e-mail (para login/autenticação)
export const findByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      ranking: true,
      victories: true,
      photo: true,
    },
  });
};

// Criar novo usuário
export const create = (
  data: Omit<UserInput, "id" | "createdAt" | "ranking" | "victories">
) => {
  return prisma.user.create({ data });
};

// Atualizar nome, foto ou senha
export const update = (
  id: number,
  data: Partial<Pick<UserInput, "name" | "photo" | "password">>
) => {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      ranking: true,
      victories: true,
      photo: true,
    },
  });
};

// Deletar usuário
export const deleteUser = (id: number) => {
  return prisma.user.delete({ where: { id } });
};
