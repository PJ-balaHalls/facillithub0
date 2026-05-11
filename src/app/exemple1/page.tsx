"use client";

import { useState, useEffect, useRef } from "react";

/* ============ CONSTANTES ============ */
const NAV_LINKS = [
  { href: "#vitrine", label: "Vitrine" },
  { href: "#cardapio", label: "Cardápio" },
  { href: "#reservas", label: "Reservas" },
  { href: "#entrega", label: "Delivery" },
  { href: "#confianca", label: "Confiança" },
  { href: "#contato", label: "Contato" },
] as const;

const MENU_ITEMS = [
  {
    id: 1,
    nome: "Carpaccio Imperial",
    categoria: "Entrada",
    preco: "R$ 68",
    descricao:
      "Lâminas nobres de filé mignon, azeite trufado artesanal, flor de sal e alcaparras importadas.",
    imagem:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80&auto=format&fit=crop",
    detalhes:
      "Finalizado com lascas de parmesão maturado 36 meses e microverdes orgânicos. Harmoniza com espumante brut ou chardonnay reservado.",
  },
  {
    id: 2,
    nome: "Risoto de Ouro",
    categoria: "Principal",
    preco: "R$ 94",
    descricao:
      "Textura cremosa com redução de vinho tinto, cogumelos selvagens e manteiga de trufa negra.",
    imagem:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=80&auto=format&fit=crop",
    detalhes:
      "Preparado lentamente com arroz arbóreo selecionado, finalizado na mesa sobre peça de granito aquecida. Acompanha sugestão de vinho tinto encorpado.",
  },
  {
    id: 3,
    nome: "Mil‑folhas Royale",
    categoria: "Sobremesa",
    preco: "R$ 42",
    descricao:
      "Camadas crocantes de massa folhada, creme diplomata leve e frutas vermelhas frescas.",
    imagem:
      "https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=900&q=80&auto=format&fit=crop",
    detalhes:
      "Montagem artística com suspiros de lichia e calda de frutas vermelhas flambada na hora. Opção sem glúten disponível.",
  },
  {
    id: 4,
    nome: "Golden Negroni",
    categoria: "Drinks",
    preco: "R$ 39",
    descricao:
      "Blend aromático com notas cítricas, toque de laranja‑baía e espuma de gengibre.",
    imagem:
      "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=900&q=80&auto=format&fit=crop",
    detalhes:
      "Versão autoral do clássico italiano, servido com gelo de esfera cristalina e finalização de raspas de limão‑siciliano.",
  },
];

const DEPOIMENTOS = [
  {
    nome: "Marina S.",
    cargo: "Jardins, SP",
    texto:
      "O ambiente digital reflete exatamente a sofisticação do meu salão. As reservas triplicaram.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop",
  },
  {
    nome: "Rafael M.",
    cargo: "Empresário",
    texto:
      "Nunca imaginei que um site pudesse traduzir tão bem a experiência presencial. Virou meu cartão de visita.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop",
  },
  {
    nome: "Carla D.",
    cargo: "Chef executiva",
    texto:
      "A seção de cardápio interativa aumentou o ticket médio. Design impecável da Facillit Hub.",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80&auto=format&fit=crop",
  },
];

/* ============ COMPONENTE PRINCIPAL ============ */
export default function RestaurantPortfolioPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<(typeof MENU_ITEMS)[0] | null>(null);
  const yearRef = useRef(new Date().getFullYear());

  /* Header com efeito glass ao scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Revelação com IntersectionObserver (tailwind não cobre observer nativo) */
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => reveals.forEach((el) => observer.unobserve(el));
  }, []);

  /* Fecha menu mobile ao navegar */
  const handleNavClick = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 antialiased">
      {/* ============ HEADER FIXO COM GLASS ============ */}
      <header
        className={`fixed inset-x-0 top-3 z-50 mx-auto w-[calc(100%-1rem)] max-w-[1220px] transition-all duration-500 ${
          scrolled
            ? "bg-white/95 shadow-2xl border-white/60"
            : "bg-white/10 backdrop-blur-2xl border-white/20 shadow-xl"
        } rounded-full border px-4 py-3`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#vitrine" className="flex items-center gap-3 font-extrabold text-gray-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-300 text-gray-900 shadow-lg shadow-amber-500/30">
              ✦
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <strong className="text-sm">Ultrapremium</strong>
              <span className="text-xs font-semibold opacity-70">Fine dining experience</span>
            </span>
          </a>

          {/* Navegação desktop */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-amber-500/10 hover:text-amber-600"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contato"
              className="ml-2 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold text-gray-900 shadow-lg shadow-amber-500/30 transition hover:bg-amber-600 hover:shadow-amber-600/30"
            >
              Quero meu site
            </a>
          </nav>

          {/* Botão mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-700 transition hover:bg-gray-200 lg:hidden"
            aria-label="Abrir menu"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>

        {/* Dropdown mobile */}
        <div
          className={`${
            menuOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden transition-all duration-500 lg:hidden`}
        >
          <nav className="mt-4 flex flex-col gap-2 rounded-3xl bg-white p-4 shadow-inner">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="rounded-2xl border border-gray-100 px-4 py-3 font-bold text-gray-700 transition hover:bg-amber-50 hover:text-amber-600"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contato"
              onClick={handleNavClick}
              className="mt-2 rounded-2xl bg-amber-500 px-6 py-3 text-center font-bold text-gray-900 shadow-md"
            >
              Quero meu site
            </a>
          </nav>
        </div>
      </header>

      {/* ============ HERO – VITRINE DO SITE ============ */}
      <section
        id="vitrine"
        className="relative flex min-h-[100svh] items-end pb-16 pt-28 text-white"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.55), rgba(10,10,10,0.74)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 md:grid-cols-[1.12fr_0.88fr]">
          {/* Copy */}
          <div className="reveal flex flex-col gap-4 opacity-0 translate-y-6 transition-all duration-700 ease-out [&.in-view]:opacity-100 [&.in-view]:translate-y-0">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold backdrop-blur-md">
                ⭐ 4,9/5 avaliação
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold backdrop-blur-md">
                🍷 Carta premium
              </span>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-amber-400">
              <span className="h-px w-8 bg-amber-400" /> Restaurante de luxo
            </span>
            <h1 className="max-w-xl text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Seu restaurante merece um site que converta desejo em reserva.
            </h1>
            <p className="max-w-lg text-base text-white/80 md:text-lg">
              Este portfólio demonstra o poder de um site premium: design sofisticado, cardápio interativo, 
              reservas com um clique e presença digital que reflete a excelência do seu salão.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contato"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-bold text-gray-900 shadow-lg shadow-amber-500/30 transition hover:bg-amber-600"
              >
                Quero um site assim
              </a>
              <a
                href="#cardapio"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 font-bold backdrop-blur-md transition hover:bg-white/15"
              >
                Ver cardápio demo
              </a>
            </div>

            {/* Mini cards de confiança */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { strong: "+8 mil", span: "clientes atendidos" },
                { strong: "15 min", span: "resposta média" },
                { strong: "100%", span: "responsivo mobile" },
              ].map((c) => (
                <div
                  key={c.strong}
                  className="rounded-2xl bg-white/10 p-3 backdrop-blur-lg border border-white/10"
                >
                  <strong className="block text-lg">{c.strong}</strong>
                  <span className="text-xs text-white/70">{c.span}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Painel lateral de destaque */}
          <aside className="reveal self-stretch rounded-3xl bg-white/10 p-4 backdrop-blur-2xl border border-white/15 shadow-2xl opacity-0 translate-y-6 transition-all duration-700 delay-100 ease-out [&.in-view]:opacity-100 [&.in-view]:translate-y-0">
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
                <h3 className="text-lg font-bold text-white">
                  Menu autoral, ambiente icônico e jornada de conversão integrada.
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Reservas, localização, redes sociais e delivery visíveis em pontos estratégicos para acelerar a decisão.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-md">📍 Jardins, SP</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-md">🕒 Seg–Dom</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-md">🚚 Delivery premium</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ============ CARDÁPIO INTERATIVO ============ */}
      <section id="cardapio" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="reveal mb-10 opacity-0 translate-y-6 transition-all duration-700 ease-out [&.in-view]:opacity-100 [&.in-view]:translate-y-0">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-amber-600">
              <span className="h-px w-8 bg-amber-600" /> Cardápio interativo
            </span>
            <h2 className="mt-2 max-w-xl text-3xl font-bold leading-tight md:text-5xl">
              O cliente explora cada prato antes mesmo de pisar no salão.
            </h2>
            <p className="mt-3 max-w-xl text-gray-500">
              Clique em qualquer card para abrir detalhes completos — essa interatividade aumenta o ticket médio e o tempo de permanência.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MENU_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setItemSelecionado(item)}
                className="reveal group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-amber-300 text-left opacity-0 translate-y-6 [&.in-view]:opacity-100 [&.in-view]:translate-y-0"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <img
                  className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={item.imagem}
                  alt={item.nome}
                  loading="lazy"
                />
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                      {item.categoria}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-600">
                      Premium
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">{item.nome}</h3>
                    <span className="text-lg font-extrabold text-gray-800">{item.preco}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{item.descricao}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-amber-600 transition group-hover:gap-2">
                    Ver detalhes <span aria-hidden="true">→</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MODAL DE DETALHES DO PRATO ============ */}
      {itemSelecionado && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setItemSelecionado(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setItemSelecionado(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-xl font-bold text-gray-800 shadow-md backdrop-blur-md transition hover:bg-white"
              aria-label="Fechar"
            >
              ×
            </button>
            <img
              className="h-64 w-full object-cover"
              src={itemSelecionado.imagem}
              alt={itemSelecionado.nome}
            />
            <div className="p-6">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                {itemSelecionado.categoria}
              </span>
              <h2 className="mt-3 text-2xl font-bold text-gray-900">{itemSelecionado.nome}</h2>
              <p className="mt-1 text-2xl font-extrabold text-gray-800">{itemSelecionado.preco}</p>
              <p className="mt-4 leading-relaxed text-gray-600">{itemSelecionado.detalhes}</p>
              <button
                onClick={() => setItemSelecionado(null)}
                className="mt-6 w-full rounded-full bg-amber-500 py-3 font-bold text-gray-900 shadow-md transition hover:bg-amber-600"
              >
                Fechar e continuar explorando
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ DEMONSTRAÇÃO DE RESERVA ============ */}
      <section id="reservas" className="bg-[#fdfbf7] py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
          <div className="reveal opacity-0 translate-y-6 transition-all duration-700 ease-out [&.in-view]:opacity-100 [&.in-view]:translate-y-0">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-amber-600">
              <span className="h-px w-8 bg-amber-600" /> Reservas inteligentes
            </span>
            <h2 className="mt-2 text-3xl font-bold leading-tight md:text-5xl">
              Um formulário que converte curiosos em clientes.
            </h2>
            <p className="mt-3 text-gray-500">
              Demonstração do fluxo de reserva que seu site terá: poucos campos, promessa clara e resposta automática via WhatsApp.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Demonstração: na versão final, os dados são enviados diretamente para o WhatsApp do restaurante.");
              }}
              className="mt-6 grid gap-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-bold text-gray-700" htmlFor="nome">
                    Nome
                  </label>
                  <input
                    id="nome"
                    type="text"
                    placeholder="Seu nome"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-800 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-gray-700" htmlFor="whatsapp">
                    WhatsApp
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-800 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-bold text-gray-700" htmlFor="data">
                    Data
                  </label>
                  <input
                    id="data"
                    type="date"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-800 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-gray-700" htmlFor="pessoas">
                    Pessoas
                  </label>
                  <select
                    id="pessoas"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-800 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5+</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-amber-500 py-3 font-bold text-gray-900 shadow-lg shadow-amber-500/20 transition hover:bg-amber-600"
              >
                Enviar (demonstração)
              </button>
            </form>
          </div>

          {/* Depoimentos */}
          <div className="reveal flex flex-col gap-4 opacity-0 translate-y-6 transition-all duration-700 delay-100 ease-out [&.in-view]:opacity-100 [&.in-view]:translate-y-0">
            {DEPOIMENTOS.map((dep) => (
              <article
                key={dep.nome}
                className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="text-amber-500">★★★★★</div>
                <p className="mt-2 text-gray-700">“{dep.texto}”</p>
                <div className="mt-3 flex items-center gap-3">
                  <img
                    className="h-10 w-10 rounded-full border-2 border-amber-200 object-cover"
                    src={dep.avatar}
                    alt={dep.nome}
                    loading="lazy"
                  />
                  <div>
                    <strong className="block text-sm">{dep.nome}</strong>
                    <span className="text-xs text-gray-500">{dep.cargo}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DELIVERY ============ */}
      <section id="entrega" className="py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
          <div className="reveal opacity-0 translate-y-6 transition-all duration-700 ease-out [&.in-view]:opacity-100 [&.in-view]:translate-y-0">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-amber-600">
              <span className="h-px w-8 bg-amber-600" /> Delivery premium
            </span>
            <h2 className="mt-2 text-3xl font-bold leading-tight md:text-5xl">
              A mesma assinatura visual da experiência presencial.
            </h2>
            <p className="mt-3 text-gray-500">
              Seção própria de delivery captura demanda sem afastar o visitante do fluxo de reservas.
            </p>
            <ul className="mt-5 space-y-3">
              {[
                "Embalagem sofisticada e percepção de valor fora do salão.",
                "CTA direto para WhatsApp, telefone ou plataforma parceira.",
                "Menu adaptado para transporte sem perder apresentação.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#contato"
              className="mt-6 inline-flex rounded-full bg-amber-500 px-6 py-3 font-bold text-gray-900 shadow-lg transition hover:bg-amber-600"
            >
              Pedir agora (demo)
            </a>
          </div>
          <div className="reveal overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm opacity-0 translate-y-6 transition-all duration-700 delay-100 ease-out [&.in-view]:opacity-100 [&.in-view]:translate-y-0">
            <img
              className="h-56 w-full object-cover"
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&q=80&auto=format&fit=crop"
              alt="Delivery premium"
              loading="lazy"
            />
            <div className="p-5">
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">Entrega</span>
              <h3 className="mt-2 text-lg font-bold text-gray-900">Experiência de alto padrão do clique à entrega.</h3>
              <p className="mt-1 text-sm text-gray-500">Textos curtos e blocos escaneáveis facilitam a decisão no mobile.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CARDS INSTITUCIONAIS DE CONFIANÇA ============ */}
      <section id="confianca" className="bg-[#fdfbf7] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="reveal mb-10 opacity-0 translate-y-6 transition-all duration-700 ease-out [&.in-view]:opacity-100 [&.in-view]:translate-y-0">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-amber-600">
              <span className="h-px w-8 bg-amber-600" /> Ambiente seguro
            </span>
            <h2 className="mt-2 text-3xl font-bold leading-tight md:text-5xl">
              Tecnologia validada, resultado comprovado.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Card Facillit Hub */}
            <div className="reveal flex flex-col items-center gap-4 rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm opacity-0 translate-y-6 transition-all duration-700 ease-out [&.in-view]:opacity-100 [&.in-view]:translate-y-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-900 p-3">
                {/* Isologo Facillit Hub */}
                <img
                  src="/images/isologos/logoblack.svg"
                  alt="Facillit Hub"
                  className="h-full w-full object-contain brightness-0 invert"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Facillit Hub</h3>
              <p className="text-sm text-gray-500">
                Design e desenvolvimento pelo time Facillit Hub, especialista em sites que convertem.
              </p>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                Equipe certificada
              </span>
            </div>

            {/* Card Google */}
            <div className="reveal flex flex-col items-center gap-4 rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm opacity-0 translate-y-6 transition-all duration-700 delay-100 ease-out [&.in-view]:opacity-100 [&.in-view]:translate-y-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50">
                <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Parceria Google</h3>
              <p className="text-sm text-gray-500">
                Validação técnica e boas práticas aprovadas pelo ecossistema Google: SEO, Core Web Vitals e indexação.
              </p>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                SEO validado
              </span>
            </div>

            {/* Card segurança */}
            <div className="reveal flex flex-col items-center gap-4 rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm opacity-0 translate-y-6 transition-all duration-700 delay-200 ease-out [&.in-view]:opacity-100 [&.in-view]:translate-y-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50">
                <svg className="h-10 w-10 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Eficácia comprovada</h3>
              <p className="text-sm text-gray-500">
                Metodologia testada em dezenas de restaurantes: mais reservas, mais delivery e presença digital impecável.
              </p>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                Resultado garantido
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section id="contato" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="reveal grid items-center gap-6 rounded-[36px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 text-white shadow-2xl md:grid-cols-[1.1fr_0.9fr] md:p-12 opacity-0 translate-y-6 transition-all duration-700 ease-out [&.in-view]:opacity-100 [&.in-view]:translate-y-0">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-amber-400">
                <span className="h-px w-8 bg-amber-400" /> Contato rápido
              </span>
              <h2 className="mt-2 text-3xl font-bold leading-tight md:text-5xl">
                Quer um site que realmente converta?
              </h2>
              <p className="mt-3 text-white/70">
                Fale com o time Facillit Hub e descubra como ter uma presença digital à altura do seu restaurante.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-bold text-gray-900 shadow-lg transition hover:bg-amber-600"
              >
                Falar no WhatsApp
              </a>
              <a
                href="mailto:contato@facillithub.com.br"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 font-bold backdrop-blur-md transition hover:bg-white/10"
              >
                Enviar e-mail
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-gray-900 py-12 text-white/80">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3 font-extrabold text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-300 text-gray-900">
                ✦
              </span>
              <span className="flex flex-col leading-tight">
                <strong className="text-sm">Ultrapremium</strong>
                <span className="text-xs font-semibold opacity-70">Fine dining experience</span>
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm text-white/60">
              Template desenvolvido pelo time de design da Facillit Hub. Eficácia comprovada e validação técnica em parceria com Google.
            </p>
          </div>
          <div>
            <strong className="mb-3 block text-white">Navegação</strong>
            <div className="flex flex-col gap-2 text-sm">
              <a href="#vitrine" className="transition hover:text-amber-400">Vitrine</a>
              <a href="#cardapio" className="transition hover:text-amber-400">Cardápio</a>
              <a href="#reservas" className="transition hover:text-amber-400">Reservas</a>
              <a href="#confianca" className="transition hover:text-amber-400">Confiança</a>
            </div>
          </div>
          <div>
            <strong className="mb-3 block text-white">Facillit Hub</strong>
            <div className="flex flex-col gap-2 text-sm">
              <a href="https://wa.me/5511999999999" className="transition hover:text-amber-400">WhatsApp</a>
              <a href="mailto:contato@facillithub.com.br" className="transition hover:text-amber-400">E-mail</a>
              <span className="text-white/50">São Paulo, SP</span>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-6xl border-t border-white/10 px-4 pt-6 text-sm text-white/50">
          © {yearRef.current} Ultrapremium — Site desenvolvido por{" "}
          <span className="font-semibold text-amber-400">Facillit Hub</span>. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}