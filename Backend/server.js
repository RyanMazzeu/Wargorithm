require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT;
const allowedOrigins = [
  "https://wargorithm.vercel.app",
  "http://localhost:5000",
  "http://127.0.0.1:5500",
  "http://192.168.1.8:5500",
  undefined,
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
app.use("/api/amigos", require("./routes/amigos"));
app.use("/api/chat", require("./routes/chat"));

// Startando o servidor
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
