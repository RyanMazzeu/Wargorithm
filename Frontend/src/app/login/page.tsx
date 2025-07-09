// src/app/login/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import styles from "./page.module.css";
import ForgotPasswordModal from "../components/ForgotPasswordModal/ForgotPasswordModal";
import logoUrl from "../assets/logo_AuthPages.svg";
import GoogleSVG from "../assets/icons/google.svg";
import FacebookSVG from "../assets/icons/facebook.svg";

const GoogleIcon = () => (
  <img src={GoogleSVG.src} alt="Google logo" className={styles.icon} />
);

const FacebookIcon = () => (
  <img src={FacebookSVG.src} alt="Facebook logo" className={styles.icon} />
);

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Login realizado com sucesso!");
        login(data.user, data.token); // Supondo que data.user e data.token existam
        router.push("/dashboard"); // Mude para a rota desejada no Next.js, ex: /dashboard ou /
      } else {
        alert(data.error || "Credenciais inválidas ou erro no login.");
      }
    } catch (error) {
      console.error("Erro de conexão ou parse:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Attempting to sign in with ${provider}`);
    alert(`Login with ${provider} (simulated)!`);
  };

  const handleForgotPasswordEmail = (forgotEmail: string) => {
    alert(`Recovery instructions sent to ${forgotEmail} (simulated)!`);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={styles.loginContainer}>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.logoContainer}>
            {/* Para assets em src/assets importados diretamente,
                precisamos usar .src para o Next.js processá-los corretamente com <img> */}
            <img src={logoUrl.src} alt="Company Logo" className={styles.logo} />
          </div>
          <h2>Sign in</h2>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div className={styles.optionsContainer}>
            <div className={styles.rememberMeContainer}>
              <div className={styles.rememberMeGroup}>
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
            </div>
            <div className={styles.forgotPasswordLinkContainer}>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className={styles.linkButton}
              >
                Forgot password?
              </button>
            </div>
          </div>
          <button type="submit" className={styles.loginButton}>
            Sign in
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerText}>or</span>
          </div>
          <div className={styles.socialLoginContainer}>
            <button
              type="button"
              className={`${styles.socialButton} ${styles.googleButton}`}
              onClick={() => handleSocialLogin("Google")}
            >
              <GoogleIcon /> Google
            </button>
            <button
              type="button"
              className={`${styles.socialButton} ${styles.facebookButton}`}
              onClick={() => handleSocialLogin("Facebook")}
            >
              <FacebookIcon /> Facebook
            </button>
          </div>
          <div className={styles.registerLink}>
            Don't have an account?
            <button
              type="button"
              onClick={() => router.push("/register")} // Use router.push
              className={styles.linkButton}
              style={{ marginLeft: "5px" }}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
      <ForgotPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSendEmail={handleForgotPasswordEmail}
      />
    </>
  );
}
