const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  buscarJogadores,
  enviarConvite,
  responderConvite,
  listarAmigos,
} = require("../controllers/amizadeController");

router.get("/buscar", authMiddleware, buscarJogadores);
router.post("/enviar", authMiddleware, enviarConvite);
router.post("/responder", authMiddleware, responderConvite);
router.get("/lista", authMiddleware, listarAmigos);

module.exports = router;
