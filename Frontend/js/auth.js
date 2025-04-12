// Frontend/js/auth.js

function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  return fetch(url, options);
}
document.addEventListener("DOMContentLoaded", async () => {
  // 2. Logout
  document.getElementById("logout-button").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "../index.html";
  });

  // 1. Verificação inicial do token
  window.addEventListener("pageshow", function (event) {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "../index.html";
    }
  });
});
