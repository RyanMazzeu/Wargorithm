import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type ChallengeFeedbackInput = Prisma.ChallengeFeedbackCreateInput;

// Listar todos os feedbacks
export const listAll = () => {
  return prisma.challengeFeedback.findMany({
    select: {
      id: true,
      rating: true,
      comment: true,
      user: { select: { id: true, name: true, photo: true } },
      challenge: { select: { id: true, title: true, difficulty: true } },
    },
    orderBy: {
      id: "desc",
    },
  });
};

// Buscar feedback por ID
export const findById = (id: number) => {
  return prisma.challengeFeedback.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, photo: true, email: true } },
      challenge: true,
    },
  });
};

// Buscar feedbacks por desafio
export const findByChallengeId = (challengeId: number) => {
  return prisma.challengeFeedback.findMany({
    where: { challengeId },
    select: {
      id: true,
      rating: true,
      comment: true,
      user: { select: { id: true, name: true, photo: true } },
    },
    orderBy: {
      id: "desc",
    },
  });
};

// Buscar feedbacks por usuário
export const findByUserId = (userId: number) => {
  return prisma.challengeFeedback.findMany({
    where: { userId },
    select: {
      id: true,
      rating: true,
      comment: true,
      challenge: { select: { id: true, title: true, difficulty: true } },
    },
    orderBy: {
      id: "desc",
    },
  });
};

// Verificar se usuário já avaliou um desafio
export const findByUserAndChallenge = (userId: number, challengeId: number) => {
  return prisma.challengeFeedback.findFirst({
    where: {
      userId,
      challengeId,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      user: { select: { id: true, name: true } },
      challenge: { select: { id: true, title: true } },
    },
  });
};

// Criar novo feedback
export const create = (data: {
  rating: number;
  comment: string;
  userId: number;
  challengeId: number;
}) => {
  return prisma.challengeFeedback.create({
    data,
    include: {
      user: { select: { id: true, name: true } },
      challenge: { select: { id: true, title: true } },
    },
  });
};

// Atualizar feedback
export const update = (
  id: number,
  data: Partial<{
    rating: number;
    comment: string;
  }>
) => {
  return prisma.challengeFeedback.update({
    where: { id },
    data,
    include: {
      user: { select: { id: true, name: true } },
      challenge: { select: { id: true, title: true } },
    },
  });
};

// Deletar feedback
export const deleteFeedback = (id: number) => {
  return prisma.challengeFeedback.delete({ where: { id } });
};

// Calcular rating médio de um desafio
export const getAverageRatingByChallenge = (challengeId: number) => {
  return prisma.challengeFeedback.aggregate({
    where: { challengeId },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });
};

// Buscar feedbacks com rating específico
export const findByRating = (rating: number) => {
  return prisma.challengeFeedback.findMany({
    where: { rating },
    select: {
      id: true,
      rating: true,
      comment: true,
      user: { select: { id: true, name: true, photo: true } },
      challenge: { select: { id: true, title: true, difficulty: true } },
    },
    orderBy: {
      id: "desc",
    },
  });
};
