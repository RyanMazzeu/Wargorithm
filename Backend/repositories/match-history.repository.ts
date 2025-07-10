import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type MatchHistoryInput = Prisma.MatchHistoryCreateInput;

// Listar todo o histórico
export const listAll = () => {
  return prisma.matchHistory.findMany({
    select: {
      id: true,
      scoreGained: true,
      wasVictory: true,
      user: { select: { id: true, name: true, photo: true } },
      match: {
        select: {
          id: true,
          startedAt: true,
          durationSeconds: true,
          challenge: { select: { id: true, title: true, difficulty: true } },
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
};

// Buscar histórico por ID
export const findById = (id: number) => {
  return prisma.matchHistory.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          photo: true,
          email: true,
          ranking: true,
        },
      },
      match: {
        include: {
          challenge: true,
          playerA: { select: { id: true, name: true } },
          playerB: { select: { id: true, name: true } },
          winner: { select: { id: true, name: true } },
        },
      },
    },
  });
};

// Buscar histórico por usuário
export const findByUserId = (userId: number) => {
  return prisma.matchHistory.findMany({
    where: { userId },
    select: {
      id: true,
      scoreGained: true,
      wasVictory: true,
      match: {
        select: {
          id: true,
          startedAt: true,
          durationSeconds: true,
          challenge: { select: { id: true, title: true, difficulty: true } },
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
};

// Buscar histórico por partida
export const findByMatchId = (matchId: number) => {
  return prisma.matchHistory.findMany({
    where: { matchId },
    select: {
      id: true,
      scoreGained: true,
      wasVictory: true,
      user: { select: { id: true, name: true, photo: true } },
    },
    orderBy: {
      scoreGained: "desc",
    },
  });
};

// Buscar vitórias de um usuário
export const findVictoriesByUserId = (userId: number) => {
  return prisma.matchHistory.findMany({
    where: {
      userId,
      wasVictory: true,
    },
    select: {
      id: true,
      scoreGained: true,
      wasVictory: true,
      match: {
        select: {
          id: true,
          startedAt: true,
          durationSeconds: true,
          challenge: { select: { id: true, title: true, difficulty: true } },
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
};

// Criar novo registro de histórico
export const create = (data: {
  scoreGained: number;
  wasVictory: boolean;
  userId: number;
  matchId: number;
}) => {
  return prisma.matchHistory.create({
    data,
    include: {
      user: { select: { id: true, name: true } },
      match: {
        select: {
          id: true,
          challenge: { select: { id: true, title: true } },
        },
      },
    },
  });
};

// Atualizar histórico
export const update = (
  id: number,
  data: Partial<{
    scoreGained: number;
    wasVictory: boolean;
  }>
) => {
  return prisma.matchHistory.update({
    where: { id },
    data,
    include: {
      user: { select: { id: true, name: true } },
      match: {
        select: {
          id: true,
          challenge: { select: { id: true, title: true } },
        },
      },
    },
  });
};

// Deletar histórico
export const deleteHistory = (id: number) => {
  return prisma.matchHistory.delete({ where: { id } });
};

// Estatísticas de pontuação por usuário
export const getScoreStatsByUserId = (userId: number) => {
  return prisma.matchHistory.aggregate({
    where: { userId },
    _sum: {
      scoreGained: true,
    },
    _avg: {
      scoreGained: true,
    },
    _count: {
      wasVictory: true,
    },
  });
};

// Top ranking por pontuação total
export const getTopRanking = (limit: number = 10) => {
  return prisma.matchHistory.groupBy({
    by: ["userId"],
    _sum: {
      scoreGained: true,
    },
    _count: {
      wasVictory: true,
    },
    orderBy: {
      _sum: {
        scoreGained: "desc",
      },
    },
    take: limit,
  });
};

// Contar vitórias de um usuário
export const countVictoriesByUserId = (userId: number) => {
  return prisma.matchHistory.count({
    where: {
      userId,
      wasVictory: true,
    },
  });
};
