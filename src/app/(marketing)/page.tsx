import Link from "next/link";
import { ArrowRight, Zap, Target, BarChart } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">
      {/* Navbar simplificada */}
      <nav className="w-full h-16 flex items-center justify-between px-8 bg-white border-b border-gray-200">
        <div className="font-bold text-xl text-primary">Facillit Hub</div>
        <div className="space-x-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black">Entrar</Link>
          <Link href="/register" className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition">
            Começar Agora
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-4 pt-32 pb-20 max-w-4xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
          A infraestrutura digital definitiva para negócios locais.
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
          Transformamos empresas excelentes no mundo real em operações online organizadas, encontráveis e prontas para vender mais. Sem complexidade.
        </p>
        <Link href="/register" className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-gray-800 transition">
          Construir minha infraestrutura <ArrowRight size={20} />
        </Link>
      </section>
    </main>
  );
}