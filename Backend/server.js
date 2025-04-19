require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT;

// Middlewares
app.use(
  cors({
    origin: "https://wargorithm.vercel.app",
    credentials: true, // ← ESSENCIAL pra cookies/autenticação
  })
);

app.use(express.json());
app.use(cookieParser());

connectDB();

// Rotas
app.use("/api/usuarios", require("./routes/usuarios"));

// Startando o servidor
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
