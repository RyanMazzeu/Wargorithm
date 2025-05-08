import API_URL from "./url.js";

document.addEventListener("DOMContentLoaded", async () => {
  const leaveButton = document.getElementById("leave-button");
  const detailFields = document.querySelectorAll(
    ".profile-details .detail-pair dd"
  );
  const [nameField, rankingField, victoriesField, emailField] = detailFields;

  leaveButton.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "../index.html";
  });

  try {
    const response = await authFetch(`${API_URL}/api/perfil`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Falha ao buscar dados do perfil");
    }

    const usuario = await response.json();

    nameField.textContent = usuario.name;
    rankingField.textContent = usuario.ranking;
    victoriesField.textContent = usuario.victories;
    emailField.textContent = usuario.email;
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar perfil. Faça login novamente.");
    window.location.href = "../index.html";
  }
});
