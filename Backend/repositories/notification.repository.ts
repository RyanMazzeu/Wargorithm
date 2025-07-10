import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type NotificationInput = Prisma.NotificationCreateInput;

// Listar todas as notificações
export const listAll = () => {
  return prisma.notification.findMany({
    select: {
      id: true,
      message: true,
      isRead: true,
      createdAt: true,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Buscar notificação por ID
export const findById = (id: number) => {
  return prisma.notification.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, photo: true } },
    },
  });
};

// Buscar notificações por usuário
export const findByUserId = (userId: number) => {
  return prisma.notification.findMany({
    where: { userId },
    select: {
      id: true,
      message: true,
      isRead: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Buscar notificações não lidas por usuário
export const findUnreadByUserId = (userId: number) => {
  return prisma.notification.findMany({
    where: {
      userId,
      isRead: false,
    },
    select: {
      id: true,
      message: true,
      isRead: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Criar nova notificação
export const create = (data: { message: string; userId: number }) => {
  return prisma.notification.create({
    data,
    select: {
      id: true,
      message: true,
      isRead: true,
      createdAt: true,
      user: { select: { id: true, name: true } },
    },
  });
};

// Marcar notificação como lida
export const markAsRead = (id: number) => {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
    select: {
      id: true,
      message: true,
      isRead: true,
      createdAt: true,
    },
  });
};

// Marcar todas as notificações de um usuário como lidas
export const markAllAsReadByUserId = (userId: number) => {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: { isRead: true },
  });
};

// Atualizar notificação
export const update = (
  id: number,
  data: Partial<{
    message: string;
    isRead: boolean;
  }>
) => {
  return prisma.notification.update({
    where: { id },
    data,
    select: {
      id: true,
      message: true,
      isRead: true,
      createdAt: true,
    },
  });
};

// Deletar notificação
export const deleteNotification = (id: number) => {
  return prisma.notification.delete({ where: { id } });
};

// Deletar notificações antigas (mais de 30 dias)
export const deleteOldNotifications = () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return prisma.notification.deleteMany({
    where: {
      createdAt: {
        lt: thirtyDaysAgo,
      },
      isRead: true,
    },
  });
};

// Contar notificações não lidas por usuário
export const countUnreadByUserId = (userId: number) => {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
};
