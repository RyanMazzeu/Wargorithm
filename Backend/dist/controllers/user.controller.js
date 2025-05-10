"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.loginUser = exports.registerUser = void 0;
const userRepository = __importStar(require("../repositories/user.repository"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6) {
        res.status(400).json({ error: "Dados inválidos." });
        return;
    }
    const userExists = await userRepository.findByEmail(email);
    if (userExists) {
        res.status(400).json({ error: "Email já cadastrado." });
        return;
    }
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const user = await userRepository.create({
        name,
        email,
        password: hashed,
        photo: null,
    });
    res.status(201).json(user);
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await userRepository.findByEmail(email);
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
        res.status(401).json({ error: "Credenciais inválidas." });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    res.json({
        message: "Login bem-sucedido.",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            ranking: user.ranking,
            victories: user.victories,
        },
    });
};
exports.loginUser = loginUser;
const getProfile = async (req, res) => {
    const userId = req.usuarioId;
    try {
        const user = await userRepository.findById(userId);
        if (!user) {
            res.status(404).json({ error: "Usuário não encontrado." });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Erro ao buscar perfil:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};
exports.getProfile = getProfile;
