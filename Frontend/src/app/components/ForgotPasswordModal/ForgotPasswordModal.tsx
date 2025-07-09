// src/components/ForgotPasswordModal/ForgotPasswordModal.tsx
import React, { useState } from "react";
import styles from "./ForgotPasswordModal.module.css";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendEmail: (email: string) => void; // Função para "enviar" o email
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSendEmail,
}) => {
  const [email, setEmail] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSendEmail(email);
    setEmail(""); // Limpa o campo após o envio
    // onClose(); // Opcional: fechar o modal automaticamente após enviar
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Esqueceu sua senha?</h2>
        <p>
          Não se preocupe! Digite seu e-mail abaixo para enviarmos instruções de
          recuperação.
        </p>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="forgot-email">Email</label>
            <input
              type="email"
              id="forgot-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
            />
          </div>
          <button type="submit" className={styles.sendButton}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
