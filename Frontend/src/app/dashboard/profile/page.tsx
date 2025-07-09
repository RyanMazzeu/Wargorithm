// src/app/dashboard/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // Importe o hook atualizado
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ProfilePage: React.FC = () => {
  // Agora podemos pegar a função 'updateUser' do contexto
  const { user, isLoading, updateUser } = useAuth();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ... (outros useStates não mudam)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  } | null>(null);

  // Mantenha a prática de usar variáveis de ambiente para a URL da API
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]); // Dependência mais específica

  const handleCloseSnackbar = () => {
    setSnackbar(null);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === user?.name) {
      setSnackbar({
        open: true,
        message: "Insira um novo nome para atualizar.",
        severity: "error",
      });
      return;
    }
    setIsUpdatingProfile(true);

    try {
      const token = user?.token;
      const response = await fetch(`${API_URL}/user/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Falha ao atualizar o perfil.");
      }

      // <<< --- AQUI ESTÁ A MÁGICA --- >>>
      // 1. Chame a função do contexto para atualizar o estado global
      updateUser({ name });

      // 2. Mostre a mensagem de sucesso
      setSnackbar({
        open: true,
        message: "Perfil atualizado com sucesso!",
        severity: "success",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro desconhecido.";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // A função handlePasswordUpdate não precisa de mudanças, pois não afeta dados visíveis no layout
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setSnackbar({
        open: true,
        message: "As senhas não coincidem.",
        severity: "error",
      });
      return;
    }
    if (password.length < 6) {
      setSnackbar({
        open: true,
        message: "A senha deve ter no mínimo 6 caracteres.",
        severity: "error",
      });
      return;
    }
    setIsUpdatingPassword(true);

    try {
      const token = user?.token;
      const response = await fetch(`${API_URL}/user/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Falha ao atualizar a senha.");
      }
      setSnackbar({
        open: true,
        message: "Senha atualizada com sucesso!",
        severity: "success",
      });
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro desconhecido.";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Stack spacing={4}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar src={user?.photo} sx={{ width: 80, height: 80 }}>
              {user?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {user?.name || "Usuário"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.email || "Email não informado"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ranking: {user?.ranking ?? "N/A"} | Vitórias:{" "}
                {user?.victories ?? 0}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box component="form" onSubmit={handleProfileUpdate}>
            <Stack spacing={2}>
              <Typography variant="h6">Atualizar Perfil</Typography>
              <TextField
                label="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                fullWidth
                required
              />
              <Box sx={{ position: "relative", alignSelf: "flex-start" }}>
                <Button
                  color="secondary"
                  type="submit"
                  variant="contained"
                  disabled={isUpdatingProfile}
                >
                  Salvar Nome
                </Button>
                {isUpdatingProfile && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
              </Box>
            </Stack>
          </Box>
          <Divider />
          <Box component="form" onSubmit={handlePasswordUpdate}>
            <Stack spacing={2}>
              <Typography variant="h6">Alterar Senha</Typography>
              <TextField
                type="password"
                label="Nova Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                fullWidth
                required
              />
              <TextField
                type="password"
                label="Confirmar Nova Senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="outlined"
                fullWidth
                required
              />
              <Box sx={{ position: "relative", alignSelf: "flex-start" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isUpdatingPassword}
                  color="secondary"
                >
                  Alterar Senha
                </Button>
                {isUpdatingPassword && (
                  <CircularProgress
                    size={24}
                    color="secondary"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Paper>
      {snackbar && (
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default ProfilePage;
