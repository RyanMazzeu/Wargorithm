// swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Wargorithm",
      version: "1.0.0",
      description: "Documentação da API de autenticação e perfil",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
  },
  apis: ["./routes/*.ts"], // <- mude para o caminho onde estão suas rotas
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
