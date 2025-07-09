// swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
//localhost:3000/docs
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
        url: "http://localhost:5000/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.ts"], // ajuste conforme o local real dos seus arquivos
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
