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

async function loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(400).json({ message: "Senha incorreta" });
    }

    res.status(200).json({
      message: "Login bem-sucedido",
      usuario: { nome: usuario.nome, email: usuario.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no login" });
  }
}

module.exports = { registrarUsuario, loginUsuario };
