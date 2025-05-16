import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.route";
import { swaggerUi, swaggerSpec } from "./swagger"; // ajuste o caminho


dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors({ origin: "*", credentials: true}));
app.use(express.json()); // converte o body para JSON

app.use("/api", userRoutes);
//👉 http://localhost:3000/api/register
//   http://localhost:3000/api/login
//   http://localhost:3000/api/profile
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//👉 http://localhost:3000/docs


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
