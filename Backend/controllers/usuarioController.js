const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");

async function registrarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body;

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = new Usuario({ nome, email, senha: senhaHash });
    await novoUsuario.save();
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
}

module.exports = { registrarUsuario };
