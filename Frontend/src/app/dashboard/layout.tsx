// COPIE E COLE ESTE CÓDIGO INTEIRO NO SEU dashboard/layout.tsx

"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Button from "@mui/material/Button";

import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import logo from "../assets/logo.svg";
import styles from "./page.module.css";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/app/components/Footer/Footer";

const paths = [
  "/dashboard",
  "/dashboard/profile",
  "/dashboard/community",
  "/dashboard/ranking",
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();

  const pathname = usePathname();
  const router = useRouter();
  const [navValue, setNavValue] = useState(0);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    // Só tome a decisão de redirecionar DEPOIS que a verificação terminar
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]); // Adicione isLoading e router

  useEffect(() => {
    const currentPathIndex = paths.indexOf(pathname);
    if (currentPathIndex !== -1) {
      setNavValue(currentPathIndex);
    } else {
      const parentPathIndex = paths.findIndex((p) => pathname.startsWith(p));
      if (parentPathIndex !== -1) {
        setNavValue(parentPathIndex);
      }
    }
  }, [pathname]);

  const handleChange = (_: any, newValue: number) => {
    router.push(paths[newValue]);
  };

  if (isLoading) {
    // Você pode criar um componente de Loading mais bonito depois
    return <div>Carregando...</div>;
  }

  if (!user) {
    return null;
  }
  // Então, renderize a página normalmente.
  return (
    <div className={styles.homePageContainer}>
      {!isMobile ? (
        <AppBar position="fixed" color="default" className={styles.desktopNav}>
          <Toolbar className={styles.toolbar}>
            <img src={logo.src} alt="Logo" className={styles.logo} />
            <Tabs
              value={navValue}
              onChange={handleChange}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Home" />
              <Tab label="Profile" />
              <Tab label="Community" />
              <Tab label="Ranking" />
            </Tabs>
            <Button
              variant="contained"
              onClick={logout} // A função logout já redireciona
              sx={{
                backgroundColor: "#CE5DDA",
                "&:hover": { backgroundColor: "#9c27b0" },
              }}
            >
              Leave
            </Button>
          </Toolbar>
        </AppBar>
      ) : (
        <BottomNavigation
          showLabels
          value={navValue}
          onChange={handleChange}
          className={styles.bottomNav}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
          <BottomNavigationAction label="Community" icon={<GroupIcon />} />
          <BottomNavigationAction label="Ranking" icon={<EmojiEventsIcon />} />
        </BottomNavigation>
      )}
      <main
        className={styles.mainContent}
        style={{ paddingTop: isMobile ? 0 : 64 }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}