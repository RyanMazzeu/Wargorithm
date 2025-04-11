// home.js

document.getElementById("logout-button").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  window.location.href = "../index.html";
});

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Verificação inicial do token
  window.addEventListener("pageshow", function (event) {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "../index.html";
    }
  });
});
