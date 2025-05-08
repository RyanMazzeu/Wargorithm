import express from "express";
import usuariosRouter from "./routes/usuarios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: "*", // Permitir todas as origens
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", usuariosRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
