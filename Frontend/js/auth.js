// Frontend/js/auth.js
function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  return fetch(url, options);
}

document.addEventListener("DOMContentLoaded", () => {
  // Proteção de rota
  if (!localStorage.getItem("token")) {
    window.location.href = "../index.html";
  }

  // Logout
  const logoutBtn = document.getElementById("logout-button");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "../index.html";
    });
  }
});
