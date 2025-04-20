// signup.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nome = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;
    const confirmarSenha = document.getElementById("confirm-password").value;

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const API_URL = "https://wargorithm.onrender.com";
    //  const API_URL = "http://localhost:5000"; 
      const response = await fetch(`${API_URL}/api/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Conta criada com sucesso!");
        console.log(data);

        window.location.href = "../index.html"; // ou o caminho que você quiser
      } else {
        alert("❌ Erro ao criar conta!");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("❌ Erro de conexão com o servidor");
    }
  });
});
