import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import friendshipRoutes from "./routes/friendship.route";
import chatbotRoutes from "./routes/chatbot.route";
import messageRoutes from "./routes/message.route";
import challengeRoutes from "./routes/challenge.route";
import matchRoutes from "./routes/match.route";
import submissionRoutes from "./routes/submission.route";
import notificationRoutes from "./routes/notification.route";
import challengeFeedbackRoutes from "./routes/challenge-feedback.route";
import matchHistoryRoutes from "./routes/match-history.route";
import { swaggerUi, swaggerSpec } from "./swagger";

const app = express();
const PORT = 5000;

app.use(cors({ origin: "*" }));

app.use(express.json());

// Rotas existentes
app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/friends", friendshipRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api", messageRoutes);

// Novas rotas
app.use("/api/challenge", challengeRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/submission", submissionRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/feedback", challengeFeedbackRoutes);
app.use("/api/history", matchHistoryRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
