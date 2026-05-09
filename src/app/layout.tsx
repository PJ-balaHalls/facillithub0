import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip"; // <-- Importação adicionada
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Facillit Hub OS",
  description: "A infraestrutura digital definitiva para negócios locais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* TooltipProvider envolve toda a aplicação */}
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}