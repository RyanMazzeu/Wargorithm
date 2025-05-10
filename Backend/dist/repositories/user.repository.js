"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.findById = exports.findByEmail = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Buscar usuário por email
const findByEmail = (email) => {
    return prisma.user.findUnique({ where: { email } });
};
exports.findByEmail = findByEmail;
// Buscar usuário por ID com campos selecionados
const findById = (id) => {
    return prisma.user.findUnique({
        where: { id },
        select: {
            name: true,
            email: true,
            ranking: true,
            victories: true,
        },
    });
};
exports.findById = findById;
// Criar novo usuário omitindo campos que não devem ser definidos manualmente
const create = (data) => {
    return prisma.user.create({ data });
};
exports.create = create;
