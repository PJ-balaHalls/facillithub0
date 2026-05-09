import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner"
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.facillithub.com.br";
const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: dark)", color: "#fafafa" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster position="top-right" richColors expand={false} /> {/* Adicione isto aqui */}
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  // Título otimizado com palavra‑chave principal e slogan
  title: {
    default:
      "Facillit Hub – Infraestrutura Digital para Negócios",
    template: "%s | Facillit Hub – Plataforma para Negócios Locais",
  },
  description:
    "Transforme seu negócio local em uma empresa digital organizada. Sites, automação, agendamentos, cardápio online e gestão de reputação. Infraestrutura digital completa – da prospecção inteligente à recorrência SaaS. Facillit Hub: o sistema operacional do comércio local.",

  // Bloco massivo de keywords extraído do PDF e contexto do negócio
  keywords: [
    // Marca e posicionamento
    "Facillit Hub",
    "infraestrutura digital",
    "negócios locais",
    "plataforma SaaS",
    "sistema operacional digital",
    "comércio local",
    "transformação digital para pequenas empresas",

    // Produtos e serviços
    "presença digital express",
    "one page profissional",
    "site para restaurante",
    "site para clínica",
    "site para salão de beleza",
    "criação de site negócio local",
    "otimização Google Maps",
    "SEO local",
    "integração WhatsApp comercial",
    "cardápio digital",
    "catálogo online",
    "agendamento online",
    "central de agendamentos",
    "gestão de reservas",
    "painel operacional para empresas",

    // Automação e IA
    "automação comercial",
    "automação de WhatsApp",
    "chatbot para negócio local",
    "respostas automáticas IA",
    "IA para respostas de avaliações",
    "monitoramento de reputação",
    "análise de reputação online",
    "prospecção inteligente de clientes",
    "CRM para pequena empresa",
    "gestão de leads",

    // Metodologia proprietária
    "Facillit Finder",
    "Facillit Sales",
    "Facillit Hub Platform",
    "prospecção inteligente",
    "análise reputacional automatizada",
    "arbitragem de reputação",
    "modelo sniper de vendas",
    "venda com problema identificado",

    // Segmentos de clientes
    "site para restaurante",
    "site para hamburgueria",
    "site para pizzaria",
    "site para cafeteria",
    "site para clínica odontológica",
    "site para dentista",
    "site para salão de beleza",
    "site para barbearia",
    "site para oficina mecânica",
    "site para imobiliária",
    "site para academia",
    "marketing digital para alimentação",
    "presença digital para saúde e estética",

    // Modelo de negócio
    "assinatura de site",
    "recorrência SaaS",
    "SaaS para negócios locais",
    "setup inicial site profissional",
    "plataforma white-label negócios locais",
    "revenda de sites",

    // Localização
    "negócios locais Brasil",
    "empresas locais",
    "pequeno negócio digital",
    "digitalização do comércio",
  ],

  authors: [{ name: "Facillit Hub", url: siteUrl }],
  creator: "Facillit Hub",
  publisher: "Facillit Hub",

  // Indexação agressiva para SEO
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

  alternates: {
    canonical: siteUrl,
  },

  // Open Graph – compartilhamento impecável (WhatsApp, Instagram, Facebook, etc.)
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Facillit Hub",
    title:
      "Facillit Hub – Infraestrutura Digital para Negócios Locais | Presença Online que Vende",
    description:
      "Seu negócio já é excelente. A internet só ainda não percebeu isso. Transformamos negócios locais em empresas digitais prontas para vender.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Facillit Hub – Infraestrutura digital para negócios locais",
      },
      // Variação secundária para maior engajamento
      {
        url: "/og-image-alt.jpg",
        width: 1200,
        height: 630,
        alt: "Painel operacional Facillit Hub – gerencie site, agendamentos e reputação",
      },
    ],
  },

  // Twitter Card – destaque no feed
  twitter: {
    card: "summary_large_image",
    site: "@facillithub",
    creator: "@facillithub",
    title:
      "Facillit Hub – Infraestrutura Digital para Negócios Locais | Presença Online que Vende",
    description:
      "Transformamos negócios locais em empresas digitais prontas para vender. Sites, automação, agendamentos e muito mais.",
    images: ["/og-image.jpg"],
  },

  // Ícones e manifest para experiência app-like
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "mask-icon",
      url: "/safari-pinned-tab.svg",
    },
  },
  manifest: "/site.webmanifest",
};

// JSON‑LD duplo: Organization + WebApplication (alavanca rich snippets para SaaS)
const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Facillit Hub",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    "Plataforma de infraestrutura digital para negócios locais. Prospecção inteligente, sites, automação, agendamentos e gestão de reputação – tudo em recorrência SaaS.",
  sameAs: [
    "https://www.instagram.com/facillithub",
    "https://twitter.com/facillithub",
    "https://www.facebook.com/facillithub",
    "https://www.linkedin.com/company/facillithub",
    "https://wa.me/5511999999999", // coloque o número real
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+55-XX-XXXXX-XXXX",
    contactType: "customer service",
    areaServed: "BR",
    availableLanguage: ["Portuguese"],
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
    price: "39.00",
    priceCurrency: "BRL",
    description: "Assinatura mensal a partir de R$39",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "128",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* Dados estruturados embutidos */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
        />

        {children}

        {/* Monitoramento real (Vercel) e Google Analytics 4 */}
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId={gaId} />
      </body>
    </html>
  );
}