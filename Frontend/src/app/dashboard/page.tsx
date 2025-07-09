// Seu arquivo page.tsx (home)

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import { useMediaQuery } from "@mui/material";
import styles from "./page.module.css";
import Image from "next/image";
import homeImage from "../assets/home_image.png"; 
import Footer from "../components/Footer/Footer";
import Chatbot from "../components/ChatBot/ChatBot"; // <-- 1. IMPORTE O CHATBOT

const DashboardHome: React.FC = () => {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width:768px)");

  return (
    // Envolvemos tudo em um React.Fragment <> para poder adicionar o Chatbot
    <> 
      <div>
        <div className={styles.homeContentContainer}>
          <div className={styles.leftSection}>
            <h1
              style={{
                padding: "20px",
                textAlign: "center",
                color: "#000",
              }}
            >
              Mostre sua lógica.
              <br />
              Vença o desafio!
            </h1>
            <p
              style={{
                padding: "20px",
                textAlign: "center",
                color: "#000",
              }}
            >
              Wargorithm é um jogo competitivo de programação onde 8 jogadores
              disputam para resolver desafios primeiro. Suba no ranking e prove
              suas habilidades!
            </p>
            <div className={styles.ctaGroup}>
              <Button
                className={styles.playButton}
                variant="contained"
                onClick={() => router.push("/play")} // Rota corrigida para /play
                sx={{
                  backgroundColor: "#CE5DDA",
                  "&:hover": { backgroundColor: "#9c27b0" },
                  padding: "10px 20px",
                  fontSize: "1rem",
                }}
                style={{
                  color: "#fff",
                  display: "block",
                  ...(isDesktop
                    ? {
                        marginLeft: 40,
                        marginBottom: 50,
                        marginRight: 0,
                      }
                    : {
                        margin: "0 auto",
                      }),
                }}
              >
                Jogar Agora
              </Button>
              <span
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#000",
                  marginBottom: "25px",
                  marginRight: "15px",
                }}
              >
                Milhares de programadores já aceitaram o desafio. Você está
                pronto?
              </span>
            </div>
          </div>
          <div className={styles.rightSection}>
            <Image
              src={homeImage}
              alt="Desafio de programação Wargorithm"
              className={styles.homeImage}
            />
          </div>
        </div>
      </div>
      <Chatbot /> {/* <-- 2. ADICIONE O COMPONENTE AQUI */}
    </>
  );
};

export default DashboardHome;