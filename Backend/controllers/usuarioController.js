const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    const token = jwt.sign({ userId: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      message: "Login bem-sucedido",
      token,
      usuario: { nome: usuario.nome, email: usuario.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no login" });
  }
}

async function getPerfilUsuario(req, res) {
  try {
    const usuario = await Usuario.findById(req.userId).select("-senha");
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar perfil" });
  }
}

module.exports = { registrarUsuario, loginUsuario, getPerfilUsuario };
