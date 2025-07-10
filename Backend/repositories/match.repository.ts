import { PrismaClient, Prisma, MatchStatus } from "@prisma/client";

const prisma = new PrismaClient();

type MatchInput = Prisma.MatchCreateInput;

// Listar todas as partidas
export const listAll = () => {
  return prisma.match.findMany({
    select: {
      id: true,
      startedAt: true,
      durationSeconds: true,
      status: true,
      createdAt: true,
      playerA: { select: { id: true, name: true, photo: true } },
      playerB: { select: { id: true, name: true, photo: true } },
      winner: { select: { id: true, name: true, photo: true } },
      challenge: { select: { id: true, title: true, difficulty: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Buscar partida por ID
export const findById = (id: number) => {
  return prisma.match.findUnique({
    where: { id },
    include: {
      playerA: { select: { id: true, name: true, photo: true, ranking: true } },
      playerB: { select: { id: true, name: true, photo: true, ranking: true } },
      winner: { select: { id: true, name: true, photo: true } },
      challenge: true,
      submissions: {
        include: {
          user: { select: { id: true, name: true } },
        },
        orderBy: { submittedAt: "asc" },
      },
      matchHistory: {
        include: {
          user: { select: { id: true, name: true } },
        },
      },
    },
  });
};

// Buscar partidas por usuário
export const findByUserId = (userId: number) => {
  return prisma.match.findMany({
    where: {
      OR: [{ playerAId: userId }, { playerBId: userId }],
    },
    select: {
      id: true,
      startedAt: true,
      durationSeconds: true,
      status: true,
      createdAt: true,
      playerA: { select: { id: true, name: true, photo: true } },
      playerB: { select: { id: true, name: true, photo: true } },
      winner: { select: { id: true, name: true, photo: true } },
      challenge: { select: { id: true, title: true, difficulty: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Buscar partidas em andamento
export const findInProgress = () => {
  return prisma.match.findMany({
    where: { status: MatchStatus.IN_PROGRESS },
    select: {
      id: true,
      startedAt: true,
      durationSeconds: true,
      status: true,
      playerA: { select: { id: true, name: true, photo: true } },
      playerB: { select: { id: true, name: true, photo: true } },
      challenge: { select: { id: true, title: true, difficulty: true } },
    },
    orderBy: {
      startedAt: "desc",
    },
  });
};

// Criar nova partida
export const create = (data: {
  startedAt: Date;
  durationSeconds: number;
  playerAId: number;
  playerBId: number;
  challengeId: number;
}) => {
  return prisma.match.create({
    data: {
      ...data,
      status: MatchStatus.IN_PROGRESS,
    },
    include: {
      playerA: { select: { id: true, name: true, photo: true } },
      playerB: { select: { id: true, name: true, photo: true } },
      challenge: { select: { id: true, title: true, difficulty: true } },
    },
  });
};

// Atualizar partida (principalmente para finalizar)
export const update = (
  id: number,
  data: Partial<{
    status: MatchStatus;
    winnerId?: number;
    durationSeconds: number;
  }>
) => {
  return prisma.match.update({
    where: { id },
    data,
    include: {
      playerA: { select: { id: true, name: true, photo: true } },
      playerB: { select: { id: true, name: true, photo: true } },
      winner: { select: { id: true, name: true, photo: true } },
      challenge: { select: { id: true, title: true, difficulty: true } },
    },
  });
};

// Deletar partida
export const deleteMatch = (id: number) => {
  return prisma.match.delete({ where: { id } });
};

// Estatísticas de partidas
export const getMatchStats = () => {
  return prisma.match.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });
};
