const mongoose = require("mongoose");

const MensagemSchema = new mongoose.Schema({
  remetente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  conteudo: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatSchema = new mongoose.Schema({
  participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }],
  mensagens: [MensagemSchema],
  ultimaMensagem: {
    conteudo: String,
    timestamp: Date,
  },
});

module.exports = mongoose.model("Chat", ChatSchema);
