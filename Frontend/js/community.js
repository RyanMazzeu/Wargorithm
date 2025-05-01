import API_URL from "./url.js";

// --- Utils ---
function getUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.userId;
}

async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };
  return fetch(url, { ...options, headers });
}

// --- DOM Elements ---
const chatContainer = document.getElementById("chat-container");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatUsername = document.getElementById("chat-username");
const closeChatBtn = document.getElementById("close-chat");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const pendingDiv = document.getElementById("pending-invites");
const friendsDiv = document.getElementById("friends-list");

let currentChatId = null;
let amigosIds = [];
let pendentesIds = [];

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", () => {


  closeChatBtn.addEventListener("click", () => {
    currentChatId = null;
    chatMessages.innerHTML = "";
    chatUsername.textContent = "";
    chatInput.value = "";
    chatContainer.style.display = "none";
  });

  searchInput.addEventListener("input", buscarJogadores);

  carregarAmigosEPendentes();
});

async function buscarJogadores() {
  const nome = searchInput.value.trim();
  if (!nome.length) return;

  const res = await authFetch(`${API_URL}/api/amigos/buscar?nome=${nome}`);
  const jogadores = await res.json();

  searchResults.innerHTML = "";
  const filtrados = jogadores.filter(
    (j) => !amigosIds.includes(j._id) && !pendentesIds.includes(j._id)
  );

  filtrados.forEach((j) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${j.nome}</strong> | Ranking: ${j.ranking}</p>
      <button class="add-friend" data-id="${j._id}">Adicionar</button>
    `;
    searchResults.appendChild(div);
  });

  document.querySelectorAll(".add-friend").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        const res = await authFetch(`${API_URL}/api/amigos/enviar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idAmigo: btn.dataset.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erro ao enviar convite");

        alert("Convite enviado!");
        searchInput.value = "";
        carregarAmigosEPendentes();
      } catch (err) {
        alert(`Erro: ${err.message}`);
      }
    });
  });
}

async function carregarAmigosEPendentes() {
  const res = await authFetch(`${API_URL}/api/amigos/lista`);
  const data = await res.json();

  pendingDiv.innerHTML = "";
  friendsDiv.innerHTML = "";

  amigosIds = (data.amigos || []).map((f) => f.amigo._id);
  pendentesIds = [
    ...(data.pendentesRecebidos || []).map((p) => p.amigo._id),
    ...(data.pendentesEnviados || []).map((p) => p.amigo._id),
  ];

  [
    ...(data.pendentesRecebidos || []),
    ...(data.pendentesEnviados || []),
  ].forEach((p) => {
    const div = document.createElement("div");
    if (p.solicitadoPor.toString() === getUserId()) {
      div.innerHTML = `
        <p><strong>${p.amigo.nome}</strong> (Convite enviado)</p>
        <button class="cancelar" data-id="${p.amigo._id}">Cancelar convite</button>
      `;
    } else {
      div.innerHTML = `
        <p><strong>${p.amigo.nome}</strong> te enviou um convite</p>
        <button class="aceitar" data-id="${p.amigo._id}" style="margin: 0 10px 0 0;">Aceitar</button>
        <button class="recusar" data-id="${p.amigo._id}">Recusar</button>
      `;
    }
    pendingDiv.appendChild(div);
  });

  data.amigos.forEach((f) => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.innerHTML = `
      <p><strong>${f.amigo.nome}</strong> | Ranking: ${f.amigo.ranking}</p>
      <div style="display: flex; gap: 10px;">
        <button class="chat" data-id="${f.amigo._id}">Chat</button>
        <button class="remove-friend" data-id="${f.amigo._id}">Remover</button>
      </div>
    `;
    div
      .querySelector(".chat")
      .addEventListener("click", () => abrirChat(f.amigo));
    div
      .querySelector(".remove-friend")
      .addEventListener("click", () => removerAmigo(f.amigo._id));
    friendsDiv.appendChild(div);
  });

  document.querySelectorAll(".aceitar").forEach((btn) => {
    btn.addEventListener("click", () => responder(btn.dataset.id, true));
  });
  document.querySelectorAll(".recusar, .cancelar").forEach((btn) => {
    btn.addEventListener("click", () => responder(btn.dataset.id, false));
  });
}

async function abrirChat(amigo) {
  if (currentChatId && !chatContainer.classList.contains("hidden")) return;

  try {
    const res = await authFetch(`${API_URL}/api/chat/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amigoId: amigo._id }),
    });

    if (!res.ok) throw new Error(await res.text());

    const chat = await res.json();
    currentChatId = chat._id;
    chatUsername.textContent = amigo.nome;
    chatMessages.innerHTML = "";
    chatContainer.style.display = "flex"; // ou "flex", ou o que você usava antes
    carregarMensagens();
  } catch (err) {
    console.error(err);
    alert("Erro ao abrir o chat. Veja o console.");
  }
}

chatInput.addEventListener("keypress", async (e) => {
  if (e.key === "Enter" && chatInput.value.trim()) {
    await enviarMensagem(chatInput.value.trim());
    chatInput.value = "";
  }
});

async function carregarMensagens() {
  if (!currentChatId) return;
  const res = await authFetch(`${API_URL}/api/chat/${currentChatId}`);
  const msgs = await res.json();
  chatMessages.innerHTML = msgs
    .map((m) => `<p><strong>${m.remetente.nome}:</strong> ${m.conteudo}</p>`)
    .join("");
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function enviarMensagem(texto) {
  await authFetch(`${API_URL}/api/chat/enviar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId: currentChatId, conteudo: texto }),
  });
  carregarMensagens();
}

async function removerAmigo(id) {
  try {
    const res = await authFetch(`${API_URL}/api/amigos/remover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idAmigo: id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro ao remover amigo");
    alert("Amigo removido!");
    carregarAmigosEPendentes();
  } catch (err) {
    alert(`Erro: ${err.message}`);
  }
}

async function responder(id, aceitar) {
  await authFetch(`${API_URL}/api/amigos/responder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idAmigo: id, aceitar }),
  });
  carregarAmigosEPendentes();
}
