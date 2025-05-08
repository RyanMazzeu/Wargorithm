import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.route";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
