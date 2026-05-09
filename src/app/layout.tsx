
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Importe o provedor de Tooltips do seu próprio componente UI
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Facillit Hub",
  description: "Infraestrutura digital para negócios locais",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* 2. Envolva toda a aplicação (children) com o TooltipProvider */}
        <TooltipProvider delayDuration={150}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}