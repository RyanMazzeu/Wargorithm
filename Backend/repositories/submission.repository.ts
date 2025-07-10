import { PrismaClient, Prisma, Language } from "@prisma/client";

const prisma = new PrismaClient();

type SubmissionInput = Prisma.SubmissionCreateInput;

// Listar todas as submissões
export const listAll = () => {
  return prisma.submission.findMany({
    select: {
      id: true,
      code: true,
      language: true,
      isCorrect: true,
      submittedAt: true,
      user: { select: { id: true, name: true, photo: true } },
      match: {
        select: {
          id: true,
          challenge: { select: { id: true, title: true } },
        },
      },
    },
    orderBy: {
      submittedAt: "desc",
    },
  });
};

// Buscar submissão por ID
export const findById = (id: number) => {
  return prisma.submission.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, photo: true, email: true } },
      match: {
        include: {
          challenge: true,
          playerA: { select: { id: true, name: true } },
          playerB: { select: { id: true, name: true } },
        },
      },
    },
  });
};

// Buscar submissões por usuário
export const findByUserId = (userId: number) => {
  return prisma.submission.findMany({
    where: { userId },
    select: {
      id: true,
      code: true,
      language: true,
      isCorrect: true,
      submittedAt: true,
      match: {
        select: {
          id: true,
          challenge: { select: { id: true, title: true, difficulty: true } },
        },
      },
    },
    orderBy: {
      submittedAt: "desc",
    },
  });
};

// Buscar submissões por partida
export const findByMatchId = (matchId: number) => {
  return prisma.submission.findMany({
    where: { matchId },
    select: {
      id: true,
      code: true,
      language: true,
      isCorrect: true,
      submittedAt: true,
      user: { select: { id: true, name: true, photo: true } },
    },
    orderBy: {
      submittedAt: "asc",
    },
  });
};

// Buscar submissões corretas por usuário
export const findCorrectByUserId = (userId: number) => {
  return prisma.submission.findMany({
    where: {
      userId,
      isCorrect: true,
    },
    select: {
      id: true,
      language: true,
      submittedAt: true,
      match: {
        select: {
          id: true,
          challenge: { select: { id: true, title: true, difficulty: true } },
        },
      },
    },
    orderBy: {
      submittedAt: "desc",
    },
  });
};

// Criar nova submissão
export const create = (data: {
  code: string;
  language: Language;
  isCorrect: boolean;
  userId: number;
  matchId: number;
}) => {
  return prisma.submission.create({
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

// Atualizar submissão
export const update = (
  id: number,
  data: Partial<{
    code: string;
    language: Language;
    isCorrect: boolean;
  }>
) => {
  return prisma.submission.update({
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

// Deletar submissão
export const deleteSubmission = (id: number) => {
  return prisma.submission.delete({ where: { id } });
};

// Estatísticas de submissões por linguagem
export const getSubmissionStatsByLanguage = () => {
  return prisma.submission.groupBy({
    by: ["language"],
    _count: {
      id: true,
    },
  });
};

// Últimas submissões de um usuário em uma partida
export const getLastSubmissionByUserAndMatch = (
  userId: number,
  matchId: number
) => {
  return prisma.submission.findFirst({
    where: {
      userId,
      matchId,
    },
    orderBy: {
      submittedAt: "desc",
    },
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
