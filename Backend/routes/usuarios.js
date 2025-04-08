const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  registrarUsuario,
  loginUsuario,
  getPerfilUsuario,
} = require("../controllers/usuarioController");

router.post("/", registrarUsuario);
router.post("/login", loginUsuario);
router.get("/perfil", authMiddleware, getPerfilUsuario);
module.exports = router;
