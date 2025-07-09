"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Stack,
  Tooltip,
} from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";

// A interface para os dados do usuário já inclui o que precisamos
interface UserData {
  id: number;
  name: string;
  email?: string;
  photo?: string;
  victories: number;
  ranking?: number; // O ranking será atribuído por nós no frontend
}

const RankingPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Estado para armazenar a lista de usuários já classificada
  const [rankedUsers, setRankedUsers] = useState<UserData[]>([]);

  // Estado para controlar o carregamento dos dados
  const [loading, setLoading] = useState(true);

  // Estado para exibir notificações (snackbar)
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  } | null>(null);

  // Funções do Snackbar (sem alterações)
  const handleCloseSnackbar = () => setSnackbar(null);
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  // --- MODIFICADO: Função para buscar e processar os dados ---
  const fetchAndProcessUserData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Buscar dados da rota pública /user. Não precisa de token.
      const response = await fetch(`${API_URL}/user`);

      if (!response.ok) {
        throw new Error(
          "Falha ao carregar os dados dos usuários. Tente novamente mais tarde."
        );
      }

      const users: UserData[] = await response.json();

      // 2. Ordenar os usuários pelo número de vitórias (do maior para o menor)
      const sortedUsers = users.sort((a, b) => b.victories - a.victories);

      // 3. Atribuir a posição do ranking a cada usuário
      const finalRanking = sortedUsers.map((user, index) => ({
        ...user,
        ranking: index + 1, // O ranking é a posição no array ordenado (começando de 1)
      }));

      setRankedUsers(finalRanking);
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro desconhecido.";
      showSnackbar(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [API_URL]); // Removido 'user' das dependências pois a rota é pública

  // Efeito para buscar os dados quando o componente montar
  useEffect(() => {
    fetchAndProcessUserData();
  }, [fetchAndProcessUserData]);

  // Renderiza um ícone de troféu para os 3 primeiros colocados
  const renderTrophy = (rank: number) => {
    const trophyStyle = {
      verticalAlign: "middle",
      marginLeft: 8,
    };
    if (rank === 1)
      return (
        <Tooltip title="1º Lugar">
          <EmojiEvents sx={{ ...trophyStyle, color: "#FFD700" }} />
        </Tooltip>
      );
    if (rank === 2)
      return (
        <Tooltip title="2º Lugar">
          <EmojiEvents sx={{ ...trophyStyle, color: "#C0C0C0" }} />
        </Tooltip>
      );
    if (rank === 3)
      return (
        <Tooltip title="3º Lugar">
          <EmojiEvents sx={{ ...trophyStyle, color: "#CD7F32" }} />
        </Tooltip>
      );
    return null;
  };

  // O loading de autenticação ainda é útil para sabermos quem é o usuário logado
  if (authLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 } }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <EmojiEvents
            sx={{ mr: 1, fontSize: "2.5rem", color: "primary.main" }}
          />
          Ranking de Jogadores
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Veja a classificação dos melhores jogadores da plataforma.
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
            <CircularProgress />
          </Box>
        ) : rankedUsers.length > 0 ? (
          <TableContainer>
            <Table aria-label="Tabela de Ranking">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Posição
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Jogador</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Vitórias
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rankedUsers.map((player) => (
                  <TableRow
                    key={player.id}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: (theme) => theme.palette.action.hover,
                      },
                      // Destaque para o usuário logado (se ele estiver logado)
                      ...(user &&
                        user.id === player.id && {
                          backgroundColor: (theme) =>
                            theme.palette.primary.light,
                          "& > *": { fontWeight: "bold" },
                        }),
                    }}
                  >
                    <TableCell align="center">
                      <Typography variant="h6" component="span">
                        {player.ranking}
                        {renderTrophy(player.ranking!)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar src={player.photo || undefined}>
                          {player.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body1">
                          {player.name}
                          {user && user.id === player.id && " (Você)"}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" component="span" color="primary">
                        {player.victories}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography
            sx={{ textAlign: "center", my: 5, color: "text.secondary" }}
          >
            O ranking ainda não está disponível ou não há jogadores
            classificados.
          </Typography>
        )}
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
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default RankingPage;
