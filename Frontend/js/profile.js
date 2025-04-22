document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("leave-button").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "../index.html";
  });

  try {
    const API_URL = "https://wargorithm.onrender.com";
    //const API_URL = "http://localhost:5000"; // URL do seu servidor local
    const response = await authFetch(`${API_URL}/api/usuarios/perfil`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Falha ao buscar dados do perfil");
    }
    const usuario = await response.json();
    // Atualiza o HTML com os dados
    document.querySelector(
      ".profile-details .detail-pair:nth-child(1) p:nth-child(2)"
    ).textContent = usuario.nome;
    document.querySelector(
      ".profile-details .detail-pair:nth-child(2) p:nth-child(2)"
    ).textContent = usuario.ranking;
    document.querySelector(
      ".profile-details .detail-pair:nth-child(3) p:nth-child(2)"
    ).textContent = usuario.vitorias;
    document.querySelector(
      ".profile-details .detail-pair:nth-child(4) p:nth-child(2)"
    ).textContent = usuario.email;
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar perfil. Faça login novamente.");
    window.location.href = "../index.html";
  }
});
