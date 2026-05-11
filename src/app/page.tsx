// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sun,
  Moon,
  Menu,
  X,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  BarChart3,
  MessageCircle,
  Search,
  CalendarCheck,
  ShoppingCart,
  Users,
  Monitor,
  BarChart4,
  ExternalLink,
  ThumbsUp,
  Star,
  Award,
  Sparkles,
  Heart,
} from "lucide-react";

// ============ CORE HOOKS ============
function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setDark(next);
  };

  return { dark, toggle };
}

// ============ MOCK UI COMPONENTES ============
function MockDashboard() {
  return (
    <div className="relative w-full rounded-2xl bg-white/60 backdrop-blur-md border border-white/30 shadow-2xl overflow-hidden dark:bg-gray-800/60 dark:border-gray-700/50">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-200/40 dark:border-gray-700/40">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-auto text-xs font-mono text-gray-500 dark:text-gray-400">painel.facillithub.com</span>
      </div>
      <div className="p-5 grid grid-cols-2 gap-4">
        <div className="h-16 rounded-xl bg-gradient-to-br from-[#cdffd8] to-[#94b9ff] p-3 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800">Reservas hoje</span>
          <span className="text-2xl font-extrabold text-gray-900">24</span>
        </div>
        <div className="h-16 rounded-xl bg-white dark:bg-gray-700 p-3 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Pedidos delivery</span>
          <span className="text-2xl font-extrabold text-gray-900 dark:text-white">12</span>
        </div>
        <div className="col-span-2 h-28 rounded-xl bg-white dark:bg-gray-700 p-4">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Avaliações Google</span>
            <span className="text-xs font-bold text-green-600 dark:text-green-400">4.8 ★</span>
          </div>
          <div className="mt-3 flex gap-1 items-end h-8">
            <div className="w-5 bg-gradient-to-t from-[#94b9ff] to-[#cdffd8] h-6 rounded" />
            <div className="w-5 bg-gradient-to-t from-[#94b9ff] to-[#cdffd8] h-8 rounded" />
            <div className="w-5 bg-gradient-to-t from-[#94b9ff] to-[#cdffd8] h-5 rounded" />
            <div className="w-5 bg-gradient-to-t from-[#94b9ff] to-[#cdffd8] h-7 rounded" />
            <div className="w-5 bg-gradient-to-t from-[#94b9ff] to-[#cdffd8] h-6 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MockTerminal() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full rounded-2xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden font-mono text-sm">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-700">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-3 text-gray-400 text-xs">facillit-cli</span>
      </div>
      <div className="p-5 space-y-3">
        {visible && (
          <>
            <p className="text-green-400">$ facillit find --segment=restaurants</p>
            <p className="text-white/70 ml-4">🔍 82 restaurantes encontrados...</p>
            <p className="text-white/70 ml-4">📊 Analisando presença digital...</p>
            <p className="text-yellow-400 ml-4">⚠️ 37 com site ausente ou desatualizado</p>
            <p className="text-blue-400 ml-4">✅ 15 oportunidades qualificadas</p>
            <p className="text-green-400 mt-4">$ facillit generate --target="Trattoria Bella"</p>
            <p className="text-white/70 ml-4">🖥️ Landing page profissional gerada em 38s</p>
            <p className="text-white/50 ml-4">_</p>
          </>
        )}
      </div>
    </div>
  );
}

// ============ PÁGINA ============
export default function LandingPage() {
  const { dark, toggle } = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Ativa a revelação após montagem completa (garante animação visível)
    setIsLoaded(true);
  }, []);

  // Classe base que controla invisibilidade inicial e a transição de entrada
  const revealClass = (initial: string) =>
    `transition-all duration-700 ease-out ${
      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    } ${initial}`;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* ============ FLOATING HEADER ============ */}
      <header className="fixed inset-x-0 top-3 z-50 mx-auto w-[calc(100%-1rem)] max-w-6xl">
        <div className="rounded-full border border-white/20 bg-white/70 backdrop-blur-2xl shadow-lg dark:bg-gray-900/70 dark:border-gray-700/40 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden">
              <img
                src="/images/isologos/logoblack.svg"
                alt="Facillit Hub"
                className="w-full h-full object-contain dark:invert transition-all duration-300"
              />
            </div>
            <span className="hidden sm:block text-sm font-extrabold text-gray-900 dark:text-white">
              Facillit Hub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "#sobre", label: "Sobre" },
              { href: "#como-funciona", label: "Método" },
              { href: "#recursos", label: "Recursos" },
              { href: "#demonstracao", label: "Demonstração" },
              { href: "#contato", label: "Contato" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-[#cdffd8]/30 dark:hover:bg-[#94b9ff]/20 transition"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={toggle}
              className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 transition hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Alternar tema"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800" aria-label="Alternar tema">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mt-2 rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-gray-200 dark:border-gray-700 shadow-2xl p-6 md:hidden">
            <nav className="flex flex-col gap-3">
              {[
                { href: "#sobre", label: "Sobre" },
                { href: "#como-funciona", label: "Método" },
                { href: "#recursos", label: "Recursos" },
                { href: "#demonstracao", label: "Demonstração" },
                { href: "#contato", label: "Contato" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-bold py-2 text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* ============ HERO ============ */}
      <section
        id="inicio"
        className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-gradient-to-br from-[#cdffd8]/30 via-white to-[#94b9ff]/30 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900"
      >
        <div className="max-w-6xl mx-auto px-4 grid gap-10 md:grid-cols-2 items-center">
          <div className={revealClass("space-y-6")}>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-sm font-bold">
                <Star size={14} className="text-yellow-500" /> 4,9/5 avaliação
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-sm font-bold">
                <Award size={14} className="text-amber-600" /> Carta premium
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-sm font-bold">
                <Sparkles size={14} className="text-amber-400" /> Experiência exclusiva
              </span>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-amber-600">
              <span className="h-px w-8 bg-amber-600" /> Restaurante de luxo
            </span>
            <h1 className="max-w-xl text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Seu restaurante merece um site que converta desejo em reserva.
            </h1>
            <p className="max-w-lg text-base text-gray-600 dark:text-gray-400 md:text-lg">
              Este portfólio demonstra o poder de um site premium: design sofisticado, cardápio interativo, 
              reservas com um clique e presença digital que reflete a excelência do seu salão.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contato"
                className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition"
              >
                Quero um site assim
              </a>
              <a
                href="#cardapio"
                className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-full font-bold hover:bg-[#cdffd8]/30 transition"
              >
                Ver cardápio demo
              </a>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { strong: "+8 mil", span: "clientes atendidos" },
                { strong: "15 min", span: "resposta média" },
                { strong: "100%", span: "responsivo mobile" },
              ].map((c) => (
                <div
                  key={c.strong}
                  className="rounded-2xl bg-amber-500/10 p-3 backdrop-blur-lg border border-amber-200/30"
                >
                  <strong className="block text-lg">{c.strong}</strong>
                  <span className="text-xs dark:text-gray-300">{c.span}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className={revealClass("self-stretch rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/15 shadow-2xl p-4")} style={{ transitionDelay: "100ms" }}>
            <div className="grid gap-4">
              <div className="grid grid-cols-[1.15fr_0.85fr] grid-rows-[180px_180px] gap-3">
                <img
                  className="row-span-2 h-full w-full rounded-2xl object-cover"
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=80&auto=format&fit=crop"
                  alt="Salão sofisticado"
                />
                <img
                  className="h-full w-full rounded-2xl object-cover"
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&q=80&auto=format&fit=crop"
                  alt="Prato autoral"
                />
                <img
                  className="h-full w-full rounded-2xl object-cover"
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80&auto=format&fit=crop"
                  alt="Chef preparando"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">Menu autoral, ambiente icônico e jornada de conversão integrada.</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Reservas, localização, redes sociais e delivery visíveis em pontos estratégicos para acelerar a decisão.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-bold">Jardins, SP</span>
                  <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-bold">Seg–Dom</span>
                  <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-bold">Delivery premium</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#cdffd8]/20 to-[#94b9ff]/20 blur-3xl -z-10" />
      </section>

      {/* ============ SEÇÃO DO PROBLEMA ============ */}
      <section id="sobre" className="py-20 md:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className={revealClass("text-center mb-14")}>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-blue-700 dark:text-blue-400">
              <span className="h-px w-8 bg-blue-700 dark:bg-blue-400" /> O problema invisível
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
              Clientes amam seu atendimento, mas não te encontram online.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            <div className={revealClass("space-y-4 p-6 rounded-3xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50")}>
              <h3 className="text-xl font-bold text-red-800 dark:text-red-400 flex items-center gap-2">
                <X size={20} /> A realidade de muitos negócios
              </h3>
              <ul className="space-y-3 text-red-700 dark:text-red-300">
                {[
                  "Sem site ou com site amador",
                  "Cardápio desatualizado ou em PDF",
                  "WhatsApp desorganizado, sem respostas rápidas",
                  "Não aparece no Google quando procuram",
                  "Zero agendamento online",
                  "Má gestão de avaliações e reputação",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <X size={16} className="mt-0.5 text-red-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={revealClass("space-y-4 p-6 rounded-3xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50")} style={{ transitionDelay: "100ms" }}>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-400 flex items-center gap-2">
                <CheckCircle size={20} /> Com o Facillit Hub
              </h3>
              <ul className="space-y-3 text-green-800 dark:text-green-300">
                {[
                  "Site profissional one‑page em horas",
                  "Cardápio digital interativo sempre atualizado",
                  "Central de WhatsApp com respostas automáticas",
                  "SEO local otimizado para Google Maps",
                  "Sistema de reservas e agendamento integrado",
                  "Monitoramento inteligente da reputação",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ COMO FUNCIONA (MÉTODO SNIPER) ============ */}
      <section id="como-funciona" className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className={revealClass("text-center mb-14")}>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-green-700 dark:text-green-400">
              <span className="h-px w-8 bg-green-700 dark:bg-green-400" /> Nosso método
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
              Identificamos a dor antes mesmo de falar com você.
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Nosso motor de prospecção inteligente encontra automaticamente empresas com alta reputação, mas baixa
              presença digital, e já apresenta a solução.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Search size={24} />,
                title: "1. Garimpo inteligente",
                desc: "Scaneamos o Google Maps para encontrar negócios com excelente avaliação, mas que não possuem site, cardápio online ou sistema de reservas.",
              },
              {
                icon: <MessageCircle size={24} />,
                title: "2. Abordagem personalizada",
                desc: "Entramos em contato pelo WhatsApp com uma proposta baseada na deficiência específica da empresa, mostrando como podemos resolver exatamente aquele problema.",
              },
              {
                icon: <Zap size={24} />,
                title: "3. Entrega em tempo recorde",
                desc: "Em menos de 24 horas, uma landing page completa, cardápio digital e sistema de reservas ficam no ar, prontos para gerar clientes.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className={revealClass("p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3")}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#cdffd8] to-[#94b9ff] flex items-center justify-center text-gray-900">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RECURSOS DA PLATAFORMA ============ */}
      <section id="recursos" className="py-20 md:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className={revealClass("text-center mb-14")}>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-blue-700 dark:text-blue-400">
              <span className="h-px w-8 bg-blue-700 dark:bg-blue-400" /> Tudo que seu negócio precisa
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
              Um painel operacional completo para dominar o digital.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Monitor size={22} />, title: "Site profissional", desc: "Landing page otimizada, responsiva e com SEO integrado. Seu negócio encontrável no Google." },
              { icon: <ShoppingCart size={22} />, title: "Cardápio/catálogo digital", desc: "Produtos e preços sempre atualizados. Os clientes visualizam e pedem pelo WhatsApp." },
              { icon: <CalendarCheck size={22} />, title: "Reservas e agendamento", desc: "Sistema de agendamento com lembretes automáticos. Menos faltas, mais reservas." },
              { icon: <BarChart3 size={22} />, title: "Reputation Center", desc: "Monitoramento de avaliações no Google, alertas e respostas automáticas com IA." },
              { icon: <MessageCircle size={22} />, title: "Central de WhatsApp", desc: "Link direto, respostas rápidas, automações simples e gestão de conversas." },
              { icon: <BarChart4 size={22} />, title: "Analytics simplificado", desc: "Métricas de visitas, reservas, pedidos e avaliações em um só lugar." },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={revealClass("p-5 rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:shadow-xl transition duration-300 group")}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#cdffd8] to-[#94b9ff] flex items-center justify-center text-gray-900 mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MOCK DE TERMINAL ============ */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-[#cdffd8]/40 via-white to-[#94b9ff]/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-4 grid gap-10 md:grid-cols-2 items-center">
          <div className={revealClass("space-y-5")}>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Arbitragem de Reputação: tecnologia que transforma deficiência em oportunidade.
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Nosso robô vasculha avaliações e comentários públicos. Onde encontrar frases como “não tem site”,
              “cardápio desatualizado” ou “telefone não funciona”, nós já temos a solução pronta.
            </p>
            <a
              href="#demonstracao"
              className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition"
            >
              Quero ver na prática <ArrowRight size={18} />
            </a>
          </div>
          <div className={revealClass("")} style={{ transitionDelay: "200ms" }}>
            <MockTerminal />
          </div>
        </div>
      </section>

      {/* ============ DEMONSTRAÇÃO (RESTAURANTE EXEMPLO) ============ */}
      <section id="demonstracao" className="py-20 md:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className={revealClass("text-center mb-14")}>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-blue-700 dark:text-blue-400">
              <span className="h-px w-8 bg-blue-700 dark:bg-blue-400" /> Demonstração ao vivo
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
              Seu restaurante pode estar online assim.
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Clique no botão abaixo para ver um exemplo real de landing page que desenvolvemos para restaurantes.
            </p>
          </div>

          <div className={revealClass("flex flex-col sm:flex-row gap-6 items-center justify-center")}>
            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden border shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80&auto=format&fit=crop"
                alt="Preview do site de restaurante"
                className="object-cover w-full h-64"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <span className="text-white font-bold text-lg">Ultrapremium – Fine dining</span>
              </div>
            </div>
            <div className="text-center sm:text-left space-y-4">
              <p className="text-gray-700 dark:text-gray-300 max-w-md">
                Veja de perto o design, a interatividade e os CTAs que fazem o cliente realizar uma reserva ou pedido em
                segundos.
              </p>
              <Link
                href="/app/exemple1"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#cdffd8] to-[#94b9ff] text-gray-900 font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition"
              >
                <ExternalLink size={20} /> Ver site demo completo
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Exemplo desenvolvido pelo time Facillit Hub.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PARCEIROS E VALIDAÇÕES ============ */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className={revealClass("mb-14")}>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-green-700 dark:text-green-400">
              <span className="h-px w-8 bg-green-700 dark:bg-green-400" /> Parceiros e validações
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
              Tecnologia aprovada pelo mercado.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <div className={revealClass("p-6 rounded-3xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700")}>
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92..." fill="#4285F4"/>
                  <path d="M12 23c2.97 0..." fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66..." fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0..." fill="#EA4335"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold">Parceria Google</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Validação técnica em SEO, Core Web Vitals e boas práticas de indexação.
              </p>
            </div>

            <div className={revealClass("p-6 rounded-3xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700")} style={{ transitionDelay: "100ms" }}>
              <div className="flex justify-center mb-4">
                <ThumbsUp size={48} className="text-blue-500" />
              </div>
              <h3 className="text-lg font-bold">+50 empresas atendidas</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Restaurantes, clínicas e salões já transformaram sua presença digital conosco.
              </p>
            </div>

            <div className={revealClass("p-6 rounded-3xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700")} style={{ transitionDelay: "200ms" }}>
              <div className="flex justify-center mb-4">
                <Shield size={48} className="text-green-500" />
              </div>
              <h3 className="text-lg font-bold">Ambiente seguro</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Dados criptografados, backup automático e suporte humano dedicado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PLANOS / ENTRADA ============ */}
      <section id="planos" className="py-20 md:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className={revealClass("text-center mb-14")}>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-blue-700 dark:text-blue-400">
              <span className="h-px w-8 bg-blue-700 dark:bg-blue-400" /> Comece agora
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
              Presença digital profissional a partir de R$150.
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Setup rápido, sem burocracia. Em poucos dias seu negócio estará no ar.
            </p>
          </div>

          <div className={revealClass("max-w-lg mx-auto bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl")}>
            <h3 className="text-2xl font-extrabold">Presença Digital Express</h3>
            <ul className="mt-6 space-y-3">
              {[
                "One Page profissional",
                "Integração WhatsApp",
                "SEO básico",
                "Google Maps otimizado",
                "Domínio personalizado",
                "Hospedagem inclusa",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold">R$150 – 200</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">setup inicial</span>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              + assinatura mensal a partir de R$39/mês
            </p>
            <a
              href="#contato"
              className="mt-6 block w-full text-center bg-gradient-to-r from-[#cdffd8] to-[#94b9ff] text-gray-900 font-bold py-3 rounded-full shadow-lg hover:scale-105 transition"
            >
              Quero para meu negócio
            </a>
          </div>
        </div>
      </section>

      {/* ============ DEPOIMENTOS ============ */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className={revealClass("text-center mb-14")}>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-green-700 dark:text-green-400">
              <span className="h-px w-8 bg-green-700 dark:bg-green-400" /> Quem já transformou
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
              Donos de negócios que deram o salto digital.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                nome: "Carlos M.",
                funcao: "Dono de restaurante",
                texto: "Meu restaurante agora aparece no Google e as reservas online não param de chegar. O Facillit Hub fez tudo em 2 dias.",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
              },
              {
                nome: "Ana P.",
                funcao: "Clínica odontológica",
                texto: "Antes os pacientes reclamavam que não achavam meu telefone. Agora o agendamento online resolveu minhas faltas.",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
              },
              {
                nome: "Juliana R.",
                funcao: "Salão de beleza",
                texto: "A central de WhatsApp que eles montaram organizou toda minha comunicação. Mais clientes e menos estresse.",
                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
              },
            ].map((dep, i) => (
              <div
                key={dep.nome}
                className={revealClass("p-6 rounded-3xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700")}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-yellow-500 mb-2 flex gap-0.5">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">“{dep.texto}”</p>
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={dep.avatar}
                    alt={dep.nome}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#cdffd8]"
                  />
                  <div>
                    <strong className="block text-sm">{dep.nome}</strong>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{dep.funcao}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTATO / CTA FINAL ============ */}
      <section id="contato" className="py-20 md:py-28 bg-gradient-to-br from-[#cdffd8] to-[#94b9ff]">
        <div className="max-w-6xl mx-auto px-4">
          <div className={revealClass("max-w-3xl mx-auto text-center space-y-6")}>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
              Pronto para digitalizar seu negócio?
            </h2>
            <p className="text-lg text-gray-800">
              Fale diretamente com a gente pelo WhatsApp ou envie um e‑mail. Respondemos em minutos.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition"
              >
                <MessageCircle size={20} /> WhatsApp
              </a>
              <a
                href="mailto:contato@facillithub.com.br"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition"
              >
                <ExternalLink size={20} /> E‑mail
              </a>
            </div>
            <p className="text-sm text-gray-700">
              Ou preencha o formulário abaixo e receba uma demonstração personalizada.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Mensagem enviada! Entraremos em contato em breve.");
                (e.target as HTMLFormElement).reset();
              }}
              className="max-w-md mx-auto mt-8 space-y-4"
            >
              <input
                type="text"
                placeholder="Seu nome"
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white"
              />
              <input
                type="tel"
                placeholder="WhatsApp"
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white"
              />
              <textarea
                placeholder="Conte um pouco sobre seu negócio..."
                rows={3}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-full font-bold hover:bg-gray-800 transition shadow-xl"
              >
                Solicitar demonstração
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden">
                <img
                  src="/images/isologos/logoblack.svg"
                  alt="Facillit Hub"
                  className="w-full h-full object-contain invert"
                />
              </div>
              <span className="font-extrabold text-lg">Facillit Hub</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              Infraestrutura digital para negócios locais. Transformamos empresas reais em digitais.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-3">Navegação</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#sobre" className="hover:text-white transition">Sobre</a></li>
              <li><a href="#como-funciona" className="hover:text-white transition">Método</a></li>
              <li><a href="#recursos" className="hover:text-white transition">Recursos</a></li>
              <li><a href="#demonstracao" className="hover:text-white transition">Demonstração</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Contato</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://wa.me/5511999999999" className="hover:text-white transition">WhatsApp</a></li>
              <li><a href="mailto:contato@facillithub.com.br" className="hover:text-white transition">E‑mail</a></li>
              <li>São Paulo, SP</li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"><Users size={18} /></a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"><MessageCircle size={18} /></a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-gray-500 flex items-center justify-center gap-1.5">
          © {new Date().getFullYear()} Facillit Hub. Todos os direitos reservados. Desenvolvido com
          <Heart size={14} className="text-red-400" /> pelo time Facillit Hub.
        </div>
      </footer>
    </div>
  );
}