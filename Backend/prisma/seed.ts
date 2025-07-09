import {
  PrismaClient,
  FriendRequestStatus,
  MatchStatus,
  Difficulty,
  Language,
} from "@prisma/client";

import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  await prisma.matchHistory.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.match.deleteMany();
  await prisma.challengeFeedback.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.friendRequest.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.user.deleteMany();

  // Usuários
  const userA = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@example.com",
      password: "123456",
      photo: "https://example.com/photo1.png",
    },
  });

  const userB = await prisma.user.create({
    data: {
      name: "Bob",
      email: "bob@example.com",
      password: "abcdef",
      photo: "https://example.com/photo2.png",
    },
  });

  // Amizade
  const friendship = await prisma.friendship.create({
    data: {
      userAId: userA.id,
      userBId: userB.id,
    },
  });

  // Mensagem
  await prisma.message.create({
    data: {
      content: "Olá, tudo bem?",
      senderId: userA.id,
      friendshipId: friendship.id,
    },
  });

  // Requisição de amizade
  await prisma.friendRequest.create({
    data: {
      senderId: userA.id,
      receiverId: userB.id,
      status: FriendRequestStatus.PENDING,
    },
  });

  // Desafio
  const challenge = await prisma.challenge.create({
    data: {
      title: "Soma de dois números",
      description: "Receba dois inteiros e retorne a soma.",
      input: "1 2",
      expectedOutput: "3",
      difficulty: Difficulty.EASY,
    },
  });

  // Partida
  const match = await prisma.match.create({
    data: {
      startedAt: new Date(),
      durationSeconds: 600,
      status: MatchStatus.IN_PROGRESS,
      playerAId: userA.id,
      playerBId: userB.id,
      challengeId: challenge.id,
    },
  });

  // Submissão
  await prisma.submission.create({
    data: {
      code: "return a + b;",
      language: Language.JAVASCRIPT,
      isCorrect: true,
      userId: userA.id,
      matchId: match.id,
    },
  });

  // Notificação
  await prisma.notification.create({
    data: {
      message: "Você foi desafiado para uma partida!",
      userId: userB.id,
    },
  });

  // Feedback de desafio
  await prisma.challengeFeedback.create({
    data: {
      rating: 5,
      comment: "Ótimo desafio, bem simples.",
      userId: userA.id,
      challengeId: challenge.id,
    },
  });

  // Histórico da partida
  await prisma.matchHistory.create({
    data: {
      scoreGained: 10,
      wasVictory: true,
      userId: userA.id,
      matchId: match.id,
    },
  });

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
