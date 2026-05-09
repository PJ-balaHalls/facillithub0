import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
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

// SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "Facillit Hub – Infraestrutura Digital para Negócios",
    template: "%s | Facillit Hub – Plataforma para Negócios Locais",
  },
  description:
    "Transforme seu negócio local em uma empresa digital organizada. Sites, automação, agendamentos, cardápio online e gestão de reputação. Infraestrutura digital completa – da prospecção inteligente à recorrência SaaS. Facillit Hub: o sistema operacional do comércio local.",
  keywords: [
    "Facillit Hub", "infraestrutura digital", "negócios locais", "plataforma SaaS",
    "sistema operacional digital", "comércio local", "transformação digital",
    "Facillit Finder", "Facillit Sales", "gestão de reputação", "SEO local"
  ],
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
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Facillit Hub",
    title: "Facillit Hub – Infraestrutura Digital para Negócios Locais",
    description: "Seu negócio já é excelente. A internet só ainda não percebeu isso.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Facillit Hub – Infraestrutura Digital para Negócios Locais",
    images: ["/og-image.jpg"],
  },
  manifest: "/site.webmanifest",
};

// JSON-LD Scripts
const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Facillit Hub",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
};

const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Facillit Hub Platform",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* Scripts de Dados Estruturados */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
        />

        {children}

        {/* Componentes de Infra e UI */}
        <Toaster position="top-right" richColors expand={false} />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId={gaId} />
      </body>
    </html>
  );
}