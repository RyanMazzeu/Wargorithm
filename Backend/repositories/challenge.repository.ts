import { PrismaClient, Prisma, Difficulty } from "@prisma/client";

const prisma = new PrismaClient();

type ChallengeInput = Prisma.ChallengeCreateInput;

// Listar todos os desafios
export const listAll = () => {
  return prisma.challenge.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      input: true,
      expectedOutput: true,
      difficulty: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Buscar desafio por ID
export const findById = (id: number) => {
  return prisma.challenge.findUnique({
    where: { id },
    include: {
      matches: {
        select: {
          id: true,
          startedAt: true,
          status: true,
          playerA: { select: { id: true, name: true } },
          playerB: { select: { id: true, name: true } },
          winner: { select: { id: true, name: true } },
        },
      },
      feedbacks: {
        select: {
          id: true,
          rating: true,
          comment: true,
          user: { select: { id: true, name: true } },
        },
      },
    },
  });
};

// Buscar desafios por dificuldade
export const findByDifficulty = (difficulty: Difficulty) => {
  return prisma.challenge.findMany({
    where: { difficulty },
    select: {
      id: true,
      title: true,
      description: true,
      difficulty: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Criar novo desafio
export const create = (data: Omit<ChallengeInput, "id" | "createdAt">) => {
  return prisma.challenge.create({
    data,
    select: {
      id: true,
      title: true,
      description: true,
      input: true,
      expectedOutput: true,
      difficulty: true,
      createdAt: true,
    },
  });
};

// Atualizar desafio
export const update = (
  id: number,
  data: Partial<Omit<ChallengeInput, "id" | "createdAt">>
) => {
  return prisma.challenge.update({
    where: { id },
    data,
    select: {
      id: true,
      title: true,
      description: true,
      input: true,
      expectedOutput: true,
      difficulty: true,
      createdAt: true,
    },
  });
};

// Deletar desafio
export const deleteChallenge = (id: number) => {
  return prisma.challenge.delete({ where: { id } });
};

// Contar desafios por dificuldade
export const countByDifficulty = () => {
  return prisma.challenge.groupBy({
    by: ["difficulty"],
    _count: {
      id: true,
    },
  });
};
