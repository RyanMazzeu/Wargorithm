// // home.js
// document.addEventListener("DOMContentLoaded", async () => {
//   // Elementos da UI
//   const userNameElement = document.createElement("span");
//   const logoutButton = document.querySelector(".logout");

//   // 1. Verificação inicial do token
//   const token = localStorage.getItem("token");
//   console.log("Token carregado:", token);
//   if (!token) {
//     window.location.href = "../index.html";
//     return;
//   }

//   try {
//     // 2. Buscar dados do usuário
//     const response = await authFetch(
//       "http://localhost:5000/api/usuarios/perfil"
//     );

//     if (!response.ok) {
//       throw new Error("Falha na autenticação");
//     }

//     const userData = await response.json();

//     // 4. Configurar o botão de jogar
//     document.querySelector(".play-button").addEventListener("click", () => {
//       if (!localStorage.getItem("token")) {
//         alert("Por favor faça login novamente");
//         window.location.href = "../index.html";
//       } else {
//         window.location.href = "#"; // Altere para a página do jogo
//       }
//     });
//   } catch (error) {
//     console.error("Erro:", error);
//     localStorage.removeItem("token");
//     window.location.href = "../index.html";
//   }

//   // 5. Configurar logout
//   logoutButton.addEventListener("click", (e) => {
//     e.preventDefault();
//     localStorage.removeItem("token");
//     window.location.href = "../index.html";
//   });
// });
