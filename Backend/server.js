require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT;
const allowedOrigins = [
  "https://wargorithm.vercel.app", // seu frontend Vercel
  "http://localhost:5000", // caso teste local
  "http://127.0.0.1:5000",
  undefined, // ← ESSENCIAL pro Postman/cURL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
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
