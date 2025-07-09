// src/app/register/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import logoUrl from "../assets/logo_AuthPages.svg";

const RegisterPage: React.FC = () => {
  const router = useRouter(); // 👈 MUDANÇA: Usando o hook do Next.js
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    // Adicionado async aqui
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    if (password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (!name || !email) {
      alert("Nome e email são obrigatórios.");
      return;
    }

    try {
      // Adicionado try-catch para o fetch
      const response = await fetch("http://localhost:5000/api/register", {
        // Mantenha seu endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json(); // Garante que sempre tentamos ler o JSON

      if (response.status === 201) {
        alert("Usuário registrado com sucesso!");
        router.push("/");
      } else {
        alert(data.error || `Erro ${response.status} durante o registro.`);
      }
    } catch (error) {
      console.error("Erro no fetch ou parse do JSON:", error);
      alert("Erro de conexão com o servidor ou resposta inválida.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      {" "}
      {/* Assume que .loginContainer é um estilo genérico para essas páginas */}
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        {" "}
        {/* Assume .loginForm para o formulário */}
        <div className={styles.logoContainer}>
          <img src={logoUrl.src} alt="Company Logo" className={styles.logo} />{" "}
          {/* 👈 MUDANÇA: logoUrl.src */}
        </div>
        <h2>Create Account</h2>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="register-email">Email</label>
          <input
            type="email"
            id="register-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="register-password">Password</label>
          <input
            type="password"
            id="register-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
            required
          />
        </div>
        <button type="submit" className={styles.loginButton}>
          Register
        </button>
        <div className={styles.registerLink}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className={styles.linkButton}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
