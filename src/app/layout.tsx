// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@next/third-parties/google"; // apenas GA4
import ConditionalGTM from "@/components/ConditionalGTM"; // GTM condicional
import "./globals.css";

// -----------------------------------------------
// FONTES – performance com next/font
// -----------------------------------------------
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// -----------------------------------------------
// URLS & IDs a partir de variáveis de ambiente
// -----------------------------------------------
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.facillithub.com.br";
const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-5Z0EL4MRMM";
const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-MW8HRRFJ"; 
// ...

// -----------------------------------------------
// VIEWPORT – configuração mobile e cores
// -----------------------------------------------
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: dark)", color: "#fafafa" },
  ],
};


// -----------------------------------------------
// METADATA SEO – base otimizada para negócios locais
// -----------------------------------------------
export const metadata: Metadata = {
  // Título dinâmico com fallback e template
  title: {
    default:
      "Facillit Hub – Infraestrutura Digital para Negócios Locais | Sistema Operacional do Comércio",
    template: "%s | Facillit Hub",
  },
  description:
    "Plataforma digital completa para negócios locais: site profissional, cardápio online, agendamento, WhatsApp organizado, gestão de reputação e muito mais. Transforme excelência operacional em clientes reais.",

  // Keywords segmentadas por nichos e serviços (long-tail)
  keywords: [
  // Termos de marca e plataforma
  "Facillit Hub",
  "Facillit Hub plataforma",
  "infraestrutura digital para negócios",
  "sistema operacional do comércio local",
  "Facillit Finder",
  "Facillit Sales",
  
  // Negócios locais abrangentes
  "negócios locais digitais",
  "digitalização de pequenos negócios",
  "transformação digital para comércio",
  "empresa local online",
  "presença digital para pequena empresa",
  "automação para negócio local",
  "site barato para negócio local",
  "plataforma SaaS para comércio",
  
  // Restaurantes e alimentação
  "site para restaurante",
  "cardápio online restaurante",
  "cardápio digital",
  "agendamento restaurante",
  "reserva online restaurante",
  "cardápio QR code",
  "delivery integrado",
  "whatsapp para restaurante",
  "hamburgueria digital",
  "pizzaria online",
  "cafeteria na internet",
  
  // Saúde e estética
  "site para clínica",
  "site para dentista",
  "agendamento online para clínicas",
  "prontuário digital simples",
  "lembrete de consulta automático",
  "clínica estética site",
  "salão de beleza agendamento",
  "barbearia digital",
  "barbearia agendamento online",
  
  // Serviços gerais
  "site para oficina mecânica",
  "agendamento oficina",
  "orçamento online oficina",
  "imobiliária digital",
  "site para corretores",
  "academia site com agenda",
  "agenda de aulas online",
  "site para escritório de advocacia",
  "site profissional para serviços",
  
  // Soluções específicas da plataforma
  "gestão de reputação online",
  "monitoramento de avaliações Google",
  "respostas automáticas IA",
  "analytics para negócio local",
  "relatórios de reputação",
  "central de contatos WhatsApp",
  "CRM para pequena empresa",
  "automação de WhatsApp Business",
  "chatbot para negócio local",
  
  // SEO e presença digital
  "SEO local",
  "otimização Google Maps",
  "Perfil da Empresa no Google",
  "aparecer no Google Maps",
  "ranquear negócio local",
  "SEO para restaurantes",
  "SEO para clínicas",
  "presença online profissional",
  
  // Dores e soluções
  "não tenho site",
  "whatsapp desorganizado",
  "telefone não funciona no Google",
  "não aparece no Google",
  "não acharam o cardápio",
  "melhorar reputação no Google",
  "gerar clientes pela internet",
  "captar clientes localmente",
  "vender mais com internet",
  
  // Termos de cauda longa para busca local
  "como criar site para salão de beleza",
  "qual melhor plataforma para agendamento",
  "cardápio online grátis",
  "site pronto para barbearia",
  "ferramenta de agendamento para clínica",
  "integração whatsapp site",
  "melhorar avaliações no Google",
  "relatório de avaliações Google",
  "automatizar respostas do Google Meu Negócio",
  
  // Segmentação regional (adicione cidades se for útil)
  "negócio local São Paulo",
  "plataforma para comércio Brasil",
  "site para empresa pequena no Rio de Janeiro",
  "agência digital para negócio local",
  
  // Diferencial competitivo
  "alternativa a agência tradicional",
  "não é só site, é plataforma",
  "infraestrutura digital acessível",
  "assinatura barata para site",
  "setup digital express",
  "presença digital completa por mensalidade",
  
  // Produtos financeiros e modelo
  "site com mensalidade baixa",
  "assinatura de site e painel",
  "plano básico site",
  "recorrência SaaS para negócio local",
],

  // Metadados de autoria e robôs
  authors: [{ name: "Facillit Hub", url: siteUrl }],
  creator: "Facillit Hub",
  publisher: "Facillit Hub",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical (pode ser sobrescrito dinamicamente por subdomínio)
  alternates: {
    canonical: siteUrl,
  },

  // Open Graph – compatível com WhatsApp, Instagram, Facebook
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Facillit Hub",
    title:
      "Facillit Hub – Infraestrutura Digital para Negócios Locais",
    description:
      "Seu negócio já é excelente. A internet só ainda não percebeu isso.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Facillit Hub – Plataforma de infraestrutura digital para negócios locais",
        type: "image/jpeg",
      },
    ],
  },

  // Twitter Card – otimizado para compartilhamento
  twitter: {
    card: "summary_large_image",
    title:
      "Facillit Hub – Infraestrutura Digital para Negócios Locais",
    description:
      "Transformamos negócios locais em empresas digitais prontas para vender.",
    images: ["/og-image.jpg"],
    site: "@facillithub",
  creator: "@facillithub",
},
  },

  // Manifest e ícones
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// -----------------------------------------------
// DADOS ESTRUTURADOS (JSON-LD) enriquecidos
// -----------------------------------------------
const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Facillit Hub",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: [
    "https://www.instagram.com/facillithub",
    "https://www.facebook.com/facillithub",
    "https://www.linkedin.com/company/facillithub",
    "https://twitter.com/facillithub",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: `${siteUrl}/contato`,
  },
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Facillit Hub",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    "target": `${siteUrl}/busca?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Facillit Hub Platform",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
  },
};

// -----------------------------------------------
// LAYOUT RAIZ
// -----------------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        {/* Pré-conexões para performance */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="preconnect" href="//www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="//www.google-analytics.com" crossOrigin="anonymous" />

        {/* Dados estruturados */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }} />
      </head>

      <body className={inter.className}>
        {/* GTM condicional (renderiza script e noscript apenas nas rotas desejadas) */}
        <ConditionalGTM gtmId={gtmId} />

        {children}

        {/* Interface e analytics */}
        <Toaster position="top-right" richColors expand={false} closeButton />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId={gaId} />
      </body>
    </html>
  );
}