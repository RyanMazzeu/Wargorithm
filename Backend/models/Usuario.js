const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  senha: { type: String, required: true },
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
