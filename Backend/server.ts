import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import friendshipRoutes from "./routes/friendship.route";
import chatbotRoutes from "./routes/chatbot.route";
import messageRoutes from "./routes/message.route";
import { swaggerUi, swaggerSpec } from "./swagger";

const app = express();
const PORT = 5000;

app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/friends", friendshipRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api", messageRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
