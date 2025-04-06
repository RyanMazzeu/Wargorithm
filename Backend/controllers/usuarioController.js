const Usuario = require("../models/Usuario");

async function registrarUsuario(req, res) {
  const { nome, senha } = req.body;
  try {
    const novoUsuario = new Usuario({ nome, senha });
    await novoUsuario.save();
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
}

module.exports = { registrarUsuario };
