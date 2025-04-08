// Frontend/js/auth.js

function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  return fetch(url, options);
}

// Opcional: Adicione outras funções relacionadas à autenticação
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}
