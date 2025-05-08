import API_URL from "./url.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form"); // <— pega aqui, depois que o DOM já está pronto
  if (!form) {
    console.error("Formulário de cadastro não encontrado na página!");
    return;
  }

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
    if (!email.includes("@") || !email.includes(".")) {
      alert("Email inválido!");
      return;
    }

    if (senha.length < 6) {
      alert("Senha deve ter no mínimo 6 caracteres.");
      return;
    }

    try {
      console.log({ name: nome, email, password: senha });

      const response = await fetch(`${API_URL}/api/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nome, email, password: senha }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Conta criada com sucesso!");
        console.log(data);
        window.location.href = "../index.html";
      } else {
        alert("❌ Erro ao criar conta!");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("❌ Erro de conexão com o servidor");
    }
  });
});
