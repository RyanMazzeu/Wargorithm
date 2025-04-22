const Usuario = require("../models/Usuario");

const buscarJogadores = async (req, res) => {
  const termo = req.query.nome;
  if (!termo)
    return res.status(400).json({ message: "Informe um nome para busca." });

  const usuarios = await Usuario.find({
    nome: { $regex: termo, $options: "i" },
    _id: { $ne: req.userId },
  }).select("nome ranking vitorias");

  res.json(usuarios);
};

const enviarConvite = async (req, res) => {
  const { idAmigo } = req.body;
  const usuarioId = req.userId;

  if (usuarioId === idAmigo)
    return res.status(400).json({ message: "Você não pode se adicionar." });

  const amigo = await Usuario.findById(idAmigo);
  const usuario = await Usuario.findById(usuarioId);

  if (!amigo)
    return res.status(404).json({ message: "Usuário não encontrado." });

  const jaExiste = usuario.amizades.find((a) => a.amigo.toString() === idAmigo);
  if (jaExiste)
    return res
      .status(400)
      .json({ message: "Convite já enviado ou amizade existente." });

  usuario.amizades.push({
    amigo: idAmigo,
    status: "pendente",
    solicitadoPor: usuarioId,
  });
  amigo.amizades.push({
    amigo: usuarioId,
    status: "pendente",
    solicitadoPor: usuarioId,
  });

  await usuario.save();
  await amigo.save();

  res.json({ message: "Convite enviado!" });
};

const responderConvite = async (req, res) => {
  const { idAmigo, aceitar } = req.body;
  const usuarioId = req.userId;

  const usuario = await Usuario.findById(usuarioId);
  const amigo = await Usuario.findById(idAmigo);

  if (!usuario || !amigo)
    return res.status(404).json({ message: "Usuário não encontrado." });

  const amizadeUsuario = usuario.amizades.find(
    (a) => a.amigo.toString() === idAmigo
  );
  const amizadeAmigo = amigo.amizades.find(
    (a) => a.amigo.toString() === usuarioId
  );

  if (!amizadeUsuario || amizadeUsuario.status !== "pendente")
    return res.status(400).json({ message: "Convite não encontrado." });

  if (aceitar) {
    amizadeUsuario.status = "aceito";
    amizadeAmigo.status = "aceito";
  } else {
    usuario.amizades = usuario.amizades.filter(
      (a) => a.amigo.toString() !== idAmigo
    );
    amigo.amizades = amigo.amizades.filter(
      (a) => a.amigo.toString() !== usuarioId
    );
  }

  await usuario.save();
  await amigo.save();

  res.json({ message: aceitar ? "Amizade aceita!" : "Convite recusado." });
};

const listarAmigos = async (req, res) => {
  const usuario = await Usuario.findById(req.userId).populate(
    "amizades.amigo",
    "nome email ranking vitorias"
  );

  if (!usuario)
    return res.status(404).json({ message: "Usuário não encontrado." });

  const amigos = [];
  const pendentesRecebidos = [];
  const pendentesEnviados = [];

  usuario.amizades.forEach((a) => {
    if (a.status === "aceito") {
      amigos.push(a);
    } else if (a.status === "pendente") {
      if (a.solicitadoPor.toString() === req.userId) {
        pendentesEnviados.push(a);
      } else {
        pendentesRecebidos.push(a);
      }
    }
  });

  res.json({ amigos, pendentesRecebidos, pendentesEnviados });
};

module.exports = {
  buscarJogadores,
  enviarConvite,
  responderConvite,
  listarAmigos,
};
