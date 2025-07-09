// src/components/Chatbot/Chatbot.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Fab,
  Paper,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
  Slide,
} from "@mui/material";
import { Chat, Close, Send, SmartToy } from "@mui/icons-material";
import styles from "./Chatbot.module.css";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá! 👋 Como posso te ajudar a entender o Wargorithm?",
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleToggleChat = () => {
    setOpen(!open);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Envia a pergunta para o backend
      const res = await fetch("http://localhost:5000/api/chatbot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify({ question: userMessage.text }),
      });
      if (!res.ok) throw new Error("Erro ao buscar resposta do assistente.");
      const data = await res.json();
      const botResponseText =
        data.response || "Desculpe, não entendi sua pergunta.";

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erro ao buscar resposta da IA:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Desculpe, não consegui processar sua pergunta. Tente novamente.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className={styles.chatbotContainer}>
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper className={styles.chatWindow} elevation={8}>
          <Box className={styles.chatHeader}>
            <Typography variant="h6">Assistente Wargorithm</Typography>
            <IconButton onClick={handleToggleChat} size="small">
              <Close />
            </IconButton>
          </Box>
          <Box className={styles.messagesContainer}>
            {messages.map((msg) => (
              <Box
                key={msg.id}
                className={`${styles.messageBubble} ${styles[msg.sender]}`}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
            ))}
            {isLoading && (
              <Box className={`${styles.messageBubble} ${styles.bot}`}>
                <CircularProgress size={20} color="inherit" />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
          <Box
            component="form"
            className={styles.inputArea}
            onSubmit={handleSendMessage}
          >
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Digite sua dúvida..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <IconButton type="submit" color="primary" disabled={isLoading}>
              <Send />
            </IconButton>
          </Box>
        </Paper>
      </Slide>

      <Fab
        color="primary"
        aria-label="Abrir chat"
        onClick={handleToggleChat}
        className={styles.fab}
      >
        {open ? <Close /> : <SmartToy />}
      </Fab>
    </Box>
  );
};

export default Chatbot;
