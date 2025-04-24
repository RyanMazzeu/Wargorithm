const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Chat = require("../models/Chat");

// Criar novo chat ou retornar existente
router.post("/abrir", auth, async (req, res) => {
  const { amigoId } = req.body;
  const usuarioId = req.userId;

  let chat = await Chat.findOne({
    participantes: { $all: [usuarioId, amigoId] },
  });

  if (!chat) {
    chat = new Chat({ participantes: [usuarioId, amigoId], mensagens: [] });
    await chat.save();
  }

  res.json(chat);
});

// Enviar mensagem
router.post("/enviar", auth, async (req, res) => {
  const { chatId, conteudo } = req.body;
  const remetente = req.userId;

  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).json({ message: "Chat não encontrado" });

  const novaMensagem = {
    remetente,
    conteudo,
  };

  chat.mensagens.push(novaMensagem);
  chat.ultimaMensagem = {
    conteudo,
    timestamp: new Date(),
  };

  await chat.save();
  res.json({ message: "Mensagem enviada!" });
});

// Listar chats do usuário
router.get("/lista", auth, async (req, res) => {
  const usuarioId = req.userId;

  const chats = await Chat.find({ participantes: usuarioId })
    .populate("participantes", "nome")
    .sort({ "ultimaMensagem.timestamp": -1 });

  res.json(chats);
});

// Buscar mensagens de um chat específico
router.get("/:chatId", auth, async (req, res) => {
  const chat = await Chat.findById(req.params.chatId).populate(
    "mensagens.remetente",
    "nome"
  );

  if (!chat) return res.status(404).json({ message: "Chat não encontrado" });

  res.json(chat.mensagens);
});

module.exports = router;
