const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  dataCadastro: { type: Date, default: Date.now },
  ranking: { type: Number, default: 0 },
  vitorias: { type: Number, default: 0 },
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
