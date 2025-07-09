// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google"; // Fonte de exemplo
import { GlobalProviders } from "./providers"; // Importe seus provedores globais

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wargorithm",
  description: "Seu app Wargorithm",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
