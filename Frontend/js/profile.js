document.addEventListener("DOMContentLoaded", async () => {
  window.addEventListener("pageshow", function (event) {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "../index.html";
    }
  });

  try {
    const response = await authFetch(
      "http://localhost:5000/api/usuarios/perfil",
      {
        method: "GET",
      }
    );
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
