// src/app/dashboard/community/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Stack,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Grid,
  Badge,
  Fab,
  TextField,
} from "@mui/material";
import {
  PersonAdd,
  CheckCircleOutline,
  CancelOutlined,
  GroupAdd,
  PeopleOutline,
  PersonRemove,
  Undo,
  ChatBubbleOutline,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

// Tipos para os dados da API (Ajustados para corresponder ao seu backend)
interface ApiUser {
  id: number;
  name: string;
  email?: string;
  photo?: string;
  ranking?: number;
  victories?: number;
}
// Tipo de amigo contendo friendshipId retornado pela API
interface Friend extends ApiUser {
  friendshipId: number;
}

// Tipos para requisições de amizade
interface FriendRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  sender?: ApiUser;
  receiver?: ApiUser;
}

// Tipos para chat
interface Message {
  id: number;
  content: string;
  sentAt: string;
  sender: ApiUser;
}

const CommunityPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const router = useRouter();

  // Early return se não autenticado ou carregando
  if (authLoading || !user) {
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

  // --- Estados para cada tipo de dado ---
  const [allUsers, setAllUsers] = useState<ApiUser[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);

  // NOVO ESTADO: Para a lista de usuários que podem ser adicionados
  const [discoverableUsers, setDiscoverableUsers] = useState<ApiUser[]>([]);

  // --- Estados de Carregamento e UI ---
  const [loading, setLoading] = useState({
    users: false,
    friends: false,
    incoming: false,
    sent: false,
  });
  const [actionStates, setActionStates] = useState<Record<string, boolean>>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  } | null>(null);
  const [currentTab, setCurrentTab] = useState(0);

  // NOVO ESTADO: Para controle da janela de chat
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // --- Funções Auxiliares ---
  const handleCloseSnackbar = () => setSnackbar(null);
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // --- Funções de Fetch da API ---
  const fetchData = useCallback(async () => {
    if (!user.token) return;

    const endpoints = {
      users: "/user",
      friends: "/friends",
      incoming: "/friends/requests/incoming",
      sent: "/friends/requests/sent",
    };

    const fetchPromises = Object.entries(endpoints).map(
      async ([key, endpoint]) => {
        setLoading((prev) => ({ ...prev, [key]: true }));
        try {
          const response = await fetch(`${API_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          if (!response.ok) throw new Error(`Falha ao buscar dados de ${key}.`);
          const data = await response.json();

          // Atualiza o estado correspondente
          if (key === "users")
            setAllUsers(data.filter((u: ApiUser) => u.id !== user.id));
          if (key === "friends") setFriends(data as Friend[]);
          if (key === "incoming") setIncomingRequests(data);
          if (key === "sent") setSentRequests(data);
        } catch (error) {
          const msg =
            error instanceof Error ? error.message : "Erro desconhecido.";
          showSnackbar(msg, "error");
        } finally {
          setLoading((prev) => ({ ...prev, [key]: false }));
        }
      }
    );

    await Promise.all(fetchPromises);
  }, [user, API_URL]);

  useEffect(() => {
    if (user && user.token) {
      fetchData();
    }
  }, [user, fetchData]);

  // NOVO useEffect: Para filtrar os usuários a serem exibidos na aba "Encontrar Usuários"
  useEffect(() => {
    // Para uma busca eficiente, criamos Sets com os IDs relevantes.
    const friendIds = new Set(friends.map((f) => f.id));
    const sentRequestReceiverIds = new Set(
      sentRequests.map((r) => r.receiverId)
    );
    const incomingRequestSenderIds = new Set(
      incomingRequests.map((r) => r.senderId)
    );

    const filtered = allUsers.filter(
      (u) =>
        !friendIds.has(u.id) && // Não é amigo
        !sentRequestReceiverIds.has(u.id) && // Não recebeu uma solicitação minha
        !incomingRequestSenderIds.has(u.id) // Não me enviou uma solicitação
    );

    setDiscoverableUsers(filtered);
  }, [allUsers, friends, sentRequests, incomingRequests]);

  // --- Funções de Ação (Interação com a API) ---

  const handleAction = async (
    actionKey: string,
    apiCall: () => Promise<any>,
    successMessage: string
  ) => {
    if (!user.token) return;
    setActionStates((prev) => ({ ...prev, [actionKey]: true }));
    try {
      await apiCall();
      showSnackbar(successMessage, "success");
      fetchData(); // Re-busca todos os dados para manter a UI consistente
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Ocorreu um erro.";
      showSnackbar(msg, "error");
    } finally {
      setActionStates((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  const sendFriendRequest = (recipientId: number) =>
    handleAction(
      `send-${recipientId}`,
      () =>
        fetch(`${API_URL}/friends/requests`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ recipientId }),
        }).then((res) => {
          if (!res.ok) throw new Error("Falha ao enviar solicitação.");
        }),
      "Solicitação de amizade enviada!"
    );

  const acceptRequest = (requestId: number) =>
    handleAction(
      `accept-${requestId}`,
      () =>
        fetch(`${API_URL}/friends/requests/${requestId}/accept`, {
          method: "POST",
          headers: { Authorization: `Bearer ${user.token}` },
        }).then((res) => {
          if (!res.ok) throw new Error("Falha ao aceitar solicitação.");
        }),
      "Amizade aceita com sucesso!"
    );

  const rejectRequest = (requestId: number) =>
    handleAction(
      `reject-${requestId}`,
      () =>
        fetch(`${API_URL}/friends/requests/${requestId}/reject`, {
          method: "POST",
          headers: { Authorization: `Bearer ${user.token}` },
        }).then((res) => {
          if (!res.ok) throw new Error("Falha ao rejeitar solicitação.");
        }),
      "Solicitação de amizade rejeitada."
    );

  const cancelRequest = (requestId: number) =>
    handleAction(
      `cancel-${requestId}`,
      () =>
        fetch(`${API_URL}/friends/requests/${requestId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        }).then((res) => {
          if (!res.ok) throw new Error("Falha ao cancelar solicitação.");
        }),
      "Solicitação cancelada."
    );

  const unfriend = (friendId: number) =>
    handleAction(
      `unfriend-${friendId}`,
      () =>
        fetch(`${API_URL}/friends/${friendId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        }).then((res) => {
          if (!res.ok) throw new Error("Falha ao remover amigo.");
        }),
      "Amizade desfeita."
    );

  // --- Renderização ---

  const renderListItem = (
    item: ApiUser | FriendRequest,
    type: "friend" | "incoming" | "sent" | "user"
  ) => {
    const person =
      "sender" in item
        ? item.sender
        : "receiver" in item
        ? item.receiver
        : (item as ApiUser) || undefined;
    const safePerson: ApiUser = person ?? {
      id: 0,
      name: "Usuário desconhecido",
      email: "",
      photo: "",
      ranking: 0,
      victories: 0,
    };
    const key = "id" in item ? item.id : 0;

    return (
      <React.Fragment key={`${type}-${key}`}>
        <ListItem
          secondaryAction={
            <Stack direction="row" spacing={1}>
              {type === "friend" && (
                <>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      // Use the full Friend object to get friendshipId
                      setSelectedFriend(item as Friend);
                      setChatOpen(true);
                    }}
                  >
                    <ChatBubbleOutline />
                  </IconButton>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<PersonRemove />}
                    onClick={() => unfriend(safePerson.id)}
                    disabled={actionStates[`unfriend-${safePerson.id}`]}
                  >
                    Remover
                  </Button>
                </>
              )}
              {type === "incoming" && "id" in item && (
                <>
                  <IconButton
                    color="success"
                    onClick={() => acceptRequest(item.id)}
                    disabled={
                      actionStates[`accept-${item.id}`] ||
                      actionStates[`reject-${item.id}`]
                    }
                  >
                    {actionStates[`accept-${item.id}`] ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      <CheckCircleOutline />
                    )}
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => rejectRequest(item.id)}
                    disabled={
                      actionStates[`accept-${item.id}`] ||
                      actionStates[`reject-${item.id}`]
                    }
                  >
                    {actionStates[`reject-${item.id}`] ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      <CancelOutlined />
                    )}
                  </IconButton>
                </>
              )}
              {type === "sent" && "id" in item && (
                <Button
                  variant="outlined"
                  color="warning"
                  size="small"
                  startIcon={<Undo />}
                  onClick={() => cancelRequest(item.id)}
                  disabled={actionStates[`cancel-${item.id}`]}
                >
                  Cancelar
                </Button>
              )}
            </Stack>
          }
        >
          <ListItemAvatar>
            <Avatar src={safePerson.photo || undefined}>
              {safePerson.name?.charAt(0).toUpperCase() || "?"}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={safePerson.name || `Usuário ID: ${safePerson.id}`}
            secondary={
              type === "incoming"
                ? "Enviou uma solicitação"
                : type === "sent"
                ? "Aguardando resposta"
                : `Ranking: ${safePerson.ranking ?? "N/A"}`
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
      </React.Fragment>
    );
  };

  const renderEmptyState = (message: string) => (
    <Typography sx={{ textAlign: "center", my: 4, color: "text.secondary" }}>
      {message}
    </Typography>
  );

  // Send chat message
  const sendChatMessage = async () => {
    if (!selectedFriend || !newMessage.trim()) return;
    try {
      const res = await fetch(
        `${API_URL}/friends/${selectedFriend.friendshipId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ content: newMessage }),
        }
      );
      if (res.ok) {
        setNewMessage("");
        // refetch
        const msg: Message = await res.json();
        setChatMessages((prev) => [...prev, msg]);
      }
    } catch {}
  };

  // Fetch past chat messages when a friend is selected
  useEffect(() => {
    const loadChatMessages = async () => {
      if (!selectedFriend || !user.token) {
        setChatMessages([]);
        return;
      }
      try {
        const res = await fetch(
          `${API_URL}/friends/${selectedFriend.friendshipId}/messages`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        if (res.ok) {
          const msgs: Message[] = await res.json();
          setChatMessages(msgs);
        }
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    };
    loadChatMessages();
  }, [selectedFriend, user.token]);

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 3 } }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <PeopleOutline sx={{ mr: 1, fontSize: "2.5rem" }} /> Comunidade
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label="Abas da comunidade"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab
                label="Meus Amigos"
                icon={<PeopleOutline />}
                iconPosition="start"
              />
              <Tab
                label={
                  <Badge color="primary" badgeContent={incomingRequests.length}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {" "}
                      <PersonAdd /> Solicitações Recebidas
                    </Box>
                  </Badge>
                }
              />
              <Tab
                label="Encontrar Usuários"
                icon={<GroupAdd />}
                iconPosition="start"
              />
              <Tab
                label="Solicitações Enviadas"
                icon={<Undo />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <Box role="tabpanel" hidden={currentTab !== 0}>
            {loading.friends ? (
              <CircularProgress />
            ) : friends.length > 0 ? (
              <List>
                {friends.map((friend) => renderListItem(friend, "friend"))}
              </List>
            ) : (
              renderEmptyState(
                "Você ainda não tem amigos. Adicione alguns na aba 'Encontrar Usuários'."
              )
            )}
          </Box>

          <Box role="tabpanel" hidden={currentTab !== 1}>
            {loading.incoming ? (
              <CircularProgress />
            ) : incomingRequests.length > 0 ? (
              <List>
                {incomingRequests.map((req) => renderListItem(req, "incoming"))}
              </List>
            ) : (
              renderEmptyState("Nenhuma solicitação de amizade recebida.")
            )}
          </Box>

          {/* MODIFICADO: Aba para encontrar usuários agora usa 'discoverableUsers' */}
          <Box role="tabpanel" hidden={currentTab !== 2}>
            {loading.users ? (
              <CircularProgress />
            ) : discoverableUsers.length > 0 ? (
              <Grid container spacing={2}>
                {discoverableUsers.map((u) => (
                  <Grid key={u.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            src={u.photo || undefined}
                            sx={{ width: 56, height: 56 }}
                          >
                            {u.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="h6">{u.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Ranking: {u.ranking ?? "N/A"}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "flex-end" }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<PersonAdd />}
                          onClick={() => sendFriendRequest(u.id)}
                          disabled={actionStates[`send-${u.id}`]}
                        >
                          {actionStates[`send-${u.id}`] ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            "Adicionar"
                          )}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              renderEmptyState(
                "Não há novos usuários para adicionar no momento."
              )
            )}
          </Box>

          <Box role="tabpanel" hidden={currentTab !== 3}>
            {loading.sent ? (
              <CircularProgress />
            ) : sentRequests.length > 0 ? (
              <List>
                {sentRequests.map((req) => renderListItem(req, "sent"))}
              </List>
            ) : (
              renderEmptyState(
                "Você não enviou nenhuma solicitação de amizade."
              )
            )}
          </Box>
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

      {/* Botão flutuante de chat */}
      <Fab
        color="primary"
        onClick={() => setChatOpen((open) => !open)}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <ChatBubbleOutline />
      </Fab>

      {/* Janela de chat */}
      {chatOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 80,
            right: 16,
            width: 300,
            height: 400,
            bgcolor: "background.paper",
            boxShadow: 3,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 1,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1" color="text.primary">
              {selectedFriend ? selectedFriend.name : "Chat"}
            </Typography>
            <IconButton
              size="small"
              onClick={() => {
                setSelectedFriend(null);
                setChatOpen(false);
              }}
            >
              <CancelOutlined />
            </IconButton>
          </Box>

          {/* Conteúdo */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>
            {!selectedFriend ? (
              // Lista de amigos
              <List>
                {friends.map((f) => (
                  <ListItem key={f.id}>
                    <ListItemButton onClick={() => setSelectedFriend(f)}>
                      <ListItemText
                        primary={f.name}
                        primaryTypographyProps={{ color: "text.primary" }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              // Mensagens
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {chatMessages.map((m) => (
                  <Box
                    key={m.id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems:
                        m.sender.id === user.id ? "flex-end" : "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {m.sender.name} -{" "}
                      {new Date(m.sentAt).toLocaleTimeString()}
                    </Typography>
                    <Box
                      sx={{
                        bgcolor:
                          m.sender.id === user.id ? "primary.main" : "grey.300",
                        color:
                          m.sender.id === user.id
                            ? "primary.contrastText"
                            : "text.primary",
                        p: 1,
                        borderRadius: 1,
                        maxWidth: "80%",
                      }}
                    >
                      {m.content}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Input de mensagem */}
          {selectedFriend && (
            <Box
              sx={{
                p: 1,
                borderTop: 1,
                borderColor: "divider",
                display: "flex",
                gap: 1,
              }}
            >
              <TextField
                fullWidth
                size="small"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem"
              />
              <Button
                variant="contained"
                size="small"
                onClick={sendChatMessage}
              >
                Enviar
              </Button>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default CommunityPage;
