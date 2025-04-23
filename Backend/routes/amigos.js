const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  buscarJogadores,
  enviarConvite,
  responderConvite,
  listarAmigos,
  removerAmigo,
} = require("../controllers/amizadeController");

router.get("/buscar", authMiddleware, buscarJogadores);
router.post("/enviar", authMiddleware, enviarConvite);
router.post("/responder", authMiddleware, responderConvite);
router.get("/lista", authMiddleware, listarAmigos);
router.post("/remover", authMiddleware, removerAmigo);

module.exports = router;
