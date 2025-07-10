import { RequestHandler } from "express";
import * as notificationRepository from "../repositories/notification.repository";

// Listar todas as notificações (admin)
export const listAllNotifications: RequestHandler = async (_req, res) => {
  try {
    const notifications = await notificationRepository.listAll();
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Erro ao listar notificações:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar notificação por ID
export const getNotificationById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID da notificação inválido." });
    return;
  }

  try {
    const notification = await notificationRepository.findById(Number(id));
    if (!notification) {
      res.status(404).json({ error: "Notificação não encontrada." });
      return;
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error("Erro ao buscar notificação:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar notificações do usuário logado
export const getMyNotifications: RequestHandler = async (req, res) => {
  const userId = (req as any).usuarioId;

  try {
    const notifications = await notificationRepository.findByUserId(userId);
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Erro ao buscar notificações do usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar notificações não lidas do usuário
export const getMyUnreadNotifications: RequestHandler = async (req, res) => {
  const userId = (req as any).usuarioId;

  try {
    const notifications = await notificationRepository.findUnreadByUserId(
      userId
    );
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Erro ao buscar notificações não lidas:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Contar notificações não lidas
export const getUnreadCount: RequestHandler = async (req, res) => {
  const userId = (req as any).usuarioId;

  try {
    const count = await notificationRepository.countUnreadByUserId(userId);
    res.status(200).json({ count });
  } catch (error) {
    console.error("Erro ao contar notificações não lidas:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Criar nova notificação
export const createNotification: RequestHandler = async (req, res) => {
  const { message, userId } = req.body;

  if (!message || !userId) {
    res.status(400).json({ error: "message e userId são obrigatórios." });
    return;
  }

  try {
    const notification = await notificationRepository.create({
      message,
      userId: Number(userId),
    });
    res.status(201).json(notification);
  } catch (error) {
    console.error("Erro ao criar notificação:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Marcar notificação como lida
export const markAsRead: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID da notificação inválido." });
    return;
  }

  try {
    const existingNotification = await notificationRepository.findById(
      Number(id)
    );
    if (!existingNotification) {
      res.status(404).json({ error: "Notificação não encontrada." });
      return;
    }

    const updatedNotification = await notificationRepository.markAsRead(
      Number(id)
    );
    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Marcar todas as notificações do usuário como lidas
export const markAllAsRead: RequestHandler = async (req, res) => {
  const userId = (req as any).usuarioId;

  try {
    const result = await notificationRepository.markAllAsReadByUserId(userId);
    res.status(200).json({
      message: "Todas as notificações foram marcadas como lidas.",
      count: result.count,
    });
  } catch (error) {
    console.error("Erro ao marcar todas as notificações como lidas:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Atualizar notificação
export const updateNotification: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { message, isRead } = req.body;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID da notificação inválido." });
    return;
  }

  try {
    const existingNotification = await notificationRepository.findById(
      Number(id)
    );
    if (!existingNotification) {
      res.status(404).json({ error: "Notificação não encontrada." });
      return;
    }

    const updateData: any = {};
    if (message) updateData.message = message;
    if (typeof isRead === "boolean") updateData.isRead = isRead;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: "Nenhum campo para atualizar." });
      return;
    }

    const updatedNotification = await notificationRepository.update(
      Number(id),
      updateData
    );
    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error("Erro ao atualizar notificação:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Deletar notificação
export const deleteNotification: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "ID da notificação inválido." });
    return;
  }

  try {
    const existingNotification = await notificationRepository.findById(
      Number(id)
    );
    if (!existingNotification) {
      res.status(404).json({ error: "Notificação não encontrada." });
      return;
    }

    await notificationRepository.deleteNotification(Number(id));
    res.status(200).json({ message: "Notificação deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar notificação:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Limpar notificações antigas
export const cleanOldNotifications: RequestHandler = async (_req, res) => {
  try {
    const result = await notificationRepository.deleteOldNotifications();
    res.status(200).json({
      message: "Notificações antigas removidas com sucesso.",
      count: result.count,
    });
  } catch (error) {
    console.error("Erro ao limpar notificações antigas:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
