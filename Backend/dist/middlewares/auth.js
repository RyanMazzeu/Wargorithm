"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: "Token não fornecido." });
        return;
    }
    const [, token] = authHeader.split(" ");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.usuarioId = decoded.id;
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Token inválido ou expirado." });
    }
};
exports.verificarToken = verificarToken;
