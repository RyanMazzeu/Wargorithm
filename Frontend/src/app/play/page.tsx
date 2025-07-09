// src/app/play/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Chip,
} from "@mui/material";
import { PlayArrow, CheckCircle, Error } from "@mui/icons-material";

const codeTemplates = {
  python: `# Imprima "Hello World!"
print("Hello World!")`,
  java: `// Imprima "Hello World!"
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
  c: `// Imprima "Hello World!"
#include <stdio.h>

int main() {
    printf("Hello World!\\n");
    return 0;
}`,
};

export default function PlayPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(codeTemplates.python);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    setCode(codeTemplates[language as keyof typeof codeTemplates]);
    setOutput("");
    setResult(null);
    setShowResult(false);
  }, [language]);

  const executeCode = async () => {
    setIsRunning(true);
    setOutput("");
    setResult(null);
    setShowResult(false);

    setTimeout(() => {
      // QUE COISA, NÃO?
      if (code.includes("Hello World!")) {
        setOutput("Hello World!");
        setResult("success");
      } else {
        setOutput("Erro: código não produz a saída esperada");
        setResult("error");
      }
      setShowResult(true);
      setIsRunning(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🎮 Wargorithm - Arena de Programação
        </Typography>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Bem-vindo, {user.name}!
        </Typography>

        <Paper sx={{ p: 2, mb: 3, bgcolor: "primary.light", color: "white" }}>
          <Typography variant="h6" gutterBottom>
            🎯 Desafio: Hello World!
          </Typography>
          <Typography variant="body1">
            Escreva um programa que imprima exatamente:{" "}
            <strong>"Hello World!"</strong>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            Linguagens aceitas: Python, Java, C
          </Typography>
        </Paper>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Editor de Código */}
          <Box sx={{ flex: { xs: 1, md: 2 } }}>
            <Box sx={{ mb: 2 }}>
              <FormControl sx={{ minWidth: 120, mr: 2 }}>
                <InputLabel>Linguagem</InputLabel>
                <Select
                  value={language}
                  label="Linguagem"
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={isRunning}
                >
                  <MenuItem value="python">Python</MenuItem>
                  <MenuItem value="java">Java</MenuItem>
                  <MenuItem value="c">C</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={
                  isRunning ? <CircularProgress size={20} /> : <PlayArrow />
                }
                onClick={executeCode}
                disabled={isRunning}
                size="large"
              >
                {isRunning ? "Executando..." : "Executar Código"}
              </Button>
            </Box>

            <TextField
              multiline
              rows={15}
              fullWidth
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Escreva seu código aqui..."
              disabled={isRunning}
              sx={{
                "& .MuiInputBase-root": {
                  fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
                  fontSize: "14px",
                },
              }}
            />
          </Box>

          {/* Painel de Resultado */}
          <Box sx={{ flex: 1, minWidth: { xs: "100%", md: "300px" } }}>
            <Typography variant="h6" gutterBottom>
              📊 Resultado
            </Typography>

            {showResult && (
              <Box sx={{ mb: 2 }}>
                {result === "success" ? (
                  <Chip
                    icon={<CheckCircle />}
                    label="✅ Sucesso!"
                    color="success"
                    sx={{ mb: 1 }}
                  />
                ) : (
                  <Chip
                    icon={<Error />}
                    label="❌ Falha"
                    color="error"
                    sx={{ mb: 1 }}
                  />
                )}
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Saída do programa:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "grey.100",
                  minHeight: 100,
                  fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
                  fontSize: "14px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {output || "Nenhuma saída ainda..."}
              </Paper>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Saída esperada:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "success.light",
                  color: "white",
                  fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
                  fontSize: "14px",
                }}
              >
                Hello World!
              </Paper>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
