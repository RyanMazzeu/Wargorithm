// login.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    try {
      const isLocalhost = ["localhost", "127.0.0.1"].includes(
        window.location.hostname
      );
      const API_URL = isLocalhost
        ? "http://localhost:5000"
        : "https://wargorithm-api.onrender.com"; // você vai mudar aqui depois de subir o back

      const response = await fetch(`${API_URL}/api/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Para enviar cookies com a requisição
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Login bem-sucedido!");
        localStorage.setItem("token", data.token); // Armazena o token

        console.log("Usuário logado:", data.usuario);
        // Redireciona para a página principal, dashboard etc
        window.location.href = "pages/home.html";
      } else {
        alert("❌ Erro ao fazer login: " + data.message);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("❌ Erro de conexão com o servidor" + "Erro:" + error);
    }
  });
});
