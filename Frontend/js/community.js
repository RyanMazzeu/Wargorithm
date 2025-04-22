import API_URL from "./url.js";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("search-input");

  let amigosIds = [];
  let pendentesIds = [];

  input.addEventListener("input", async () => {
    const nome = input.value.trim();
    if (nome.length === 0) return;

    const res = await authFetch(`${API_URL}/api/amigos/buscar?nome=${nome}`);
    const jogadores = await res.json();
    const container = document.getElementById("search-results");
    container.innerHTML = "";

    // filtra jogadores que já são amigos ou têm convite pendente
    const filtrados = jogadores.filter(
      (j) => !amigosIds.includes(j._id) && !pendentesIds.includes(j._id)
    );

    filtrados.forEach((j) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <p><strong>${j.nome}</strong> | Ranking: ${j.ranking}</p>
        <button class="add-friend" data-id="${j._id}">Adicionar</button>
      `;
      container.appendChild(div);
    });

    document.querySelectorAll(".add-friend").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          const res = await authFetch(`${API_URL}/api/amigos/enviar`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idAmigo: btn.dataset.id }),
          });
          const data = await res.json();
          if (!res.ok)
            throw new Error(data.message || "Erro ao enviar convite");

          alert("Convite enviado!");
          input.value = ""; // limpa a busca
          carregarAmigosEPendentes();
        } catch (err) {
          alert(`Erro: ${err.message}`);
        }
      });
    });
  });

  async function carregarAmigosEPendentes() {
    const res = await authFetch(`${API_URL}/api/amigos/lista`);
    const data = await res.json();

    const pendingDiv = document.getElementById("pending-invites");
    const friendsDiv = document.getElementById("friends-list");

    pendingDiv.innerHTML = "";
    friendsDiv.innerHTML = "";

    // atualiza listas de IDs para filtrar na busca
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
        // convite enviado por mim
        div.innerHTML = `
          <p><strong>${p.amigo.nome}</strong> (Convite enviado)</p>
          <button class="cancelar" data-id="${p.amigo._id}">Cancelar convite</button>
        `;
      } else {
        // convite recebido
        div.innerHTML = `
          <p><strong>${p.amigo.nome}</strong> te enviou um convite</p>
          <button class="aceitar" data-id="${p.amigo._id}" style="margin: 0 10px;">Aceitar</button>
          <button class="recusar" data-id="${p.amigo._id}">Recusar</button>
        `;
      }

      pendingDiv.appendChild(div);
    });

    data.amigos.forEach((f) => {
      const div = document.createElement("div");
      div.innerHTML = `<p><strong>${f.amigo.nome}</strong> | Ranking: ${f.amigo.ranking}</p>`;
      friendsDiv.appendChild(div);
    });

    document.querySelectorAll(".aceitar").forEach((btn) => {
      btn.addEventListener("click", () => responder(btn.dataset.id, true));
    });

    document.querySelectorAll(".recusar").forEach((btn) => {
      btn.addEventListener("click", () => responder(btn.dataset.id, false));
    });

    document.querySelectorAll(".cancelar").forEach((btn) => {
      btn.addEventListener("click", () => responder(btn.dataset.id, false));
    });
  }

  async function responder(id, aceitar) {
    await authFetch(`${API_URL}/api/amigos/responder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idAmigo: id, aceitar }),
    });
    carregarAmigosEPendentes();
  }

  function getUserId() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  }

  carregarAmigosEPendentes();
});
