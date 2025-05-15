import API_URL from "./url.js";
const form = document.querySelector("form");

function login() {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("✅ Login bem-sucedido!");
        window.location.href = "pages/home.html";
      } else {
        alert("❌ Erro ao fazer login: " + (data.error || data.message));
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("❌ Erro de conexão com o servidor");
    }
  });
}

document.addEventListener("DOMContentLoaded", login);
